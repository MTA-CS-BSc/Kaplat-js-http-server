import { Router, json } from 'express'
import {
    validateStatus,
    validateContentParams,
    validateUpdateParams, validateCreateTodo
} from '../validators/validators.js'
import { getSortFunction } from '../modules/helpers.js'
import todoLogger from '../logging/loggers/TodoLogger.js'
import persistence from "../dicts/persistence.js";
import todoSchema from "../modules/TodoSchema.js";
import status from "../dicts/status.js";
import {createMongoManager} from "../db/MongoManager.js";
import {createPostgresManager} from "../db/PostgresManager.js";

const router = Router()
router.use(json())

const { getRepo: getMongoRepo } = createMongoManager()
const { getRepo: getPostgresRepo } = createPostgresManager()

router.get('/health', (req, res) => {
    res.status(200).send('OK')
})

router.post('/', async (req, res) => {
    const id = await getPostgresRepo().maximum('rawid').then(value => value + 1)
    const { error, value } = todoSchema.validate({ rawid: id, state: status.PENDING, ...req.body})
    value.duedate = value.dueDate
    delete value.dueDate

    const todos = await getMongoRepo().find()
    const validateTodoErrMessage = validateCreateTodo({ error, value, todos })

    if (!validateTodoErrMessage) {
        todoLogger.info(`Creating new TODO with Title [${req.body.title}]`)
        todoLogger.debug(`Currently there are ${await getMongoRepo().count()} Todos in the system. New TODO will be assigned with id ${id}`)

        await getMongoRepo().save(value)
        await getPostgresRepo().save(value)

        res.status(200).json({result: id})
    }

    else
        res.status(409).json({errorMessage: validateTodoErrMessage})
})

router.put('/', async (req, res) => {
    const id = parseInt(req.query?.id)
    const newStatus = req.query?.status
    const todos = await getMongoRepo().find()

    todoLogger.info(`Update TODO id [${id}] state to ${newStatus}`)

    const validateUpdateErrorMessage = validateUpdateParams({todos, id, newStatus})

    if (!validateUpdateErrorMessage) {
        const todoToUpdate = await getMongoRepo().findOneBy({ rawid: id })
        todoLogger.debug(`Todo id [${id}] state change: ${todoToUpdate.state} --> ${newStatus}`)

        await getMongoRepo().update({ rawid: id }, { state: newStatus })
        await getPostgresRepo().update({ rawid: id }, { state: newStatus })
        res.status(200).json({result: todoToUpdate.state})
    }

    else
        res.status(400).json({ errorMessage: validateUpdateErrorMessage })
})

router.delete('/', async (req, res) => {
    const id = parseInt(req.query?.id)

    if (!id)
        res.status(400).send('Error: Invalid id')

    else {
        todoLogger.info(`Removing todo id ${id}`)
        const todosAmountBeforeRemoval = await getMongoRepo().count()
        await getMongoRepo().delete({ rawid: id })
        await getPostgresRepo().delete({ rawid: id })
        const todosAmountAfterRemoval = await getMongoRepo().count()

        if (todosAmountBeforeRemoval > todosAmountAfterRemoval) {
            todoLogger.debug(`After removing todo id [${id}] there are ${todosAmountAfterRemoval} TODOs in the system`)
            res.status(200).json({ result: todosAmountAfterRemoval })
        }

        else
            res.status(404).json({ errorMessage: `Error: no such TODO with id ${id}`})

    }
})

router.get('/size', (req, res) => {
    const statusFilter = req.query?.status
    const persistenceMethod = req.query?.persistenceMethod
    
    if (!persistenceMethod || !statusFilter || !validateStatus(statusFilter, true))
        res.status(400).send('Parameters are invalid')

    else {
        const where = {}

        if (statusFilter !== 'ALL')
            where.state = statusFilter

        if (persistenceMethod === persistence.MONGO) {
            getMongoRepo().countBy(where).then(amount => {
                todoLogger.info(`Total TODOs count for state ${statusFilter} is ${amount}`)
                res.status(200).json({ result: amount })
            })
        }

        else {
            getPostgresRepo().countBy(where).then(amount => {
                todoLogger.info(`Total TODOs count for state ${statusFilter} is ${amount}`)
                res.status(200).json({ result: amount })
            })
        }
    }
})

router.get('/content', async (req, res) => {
    const statusFilter = req.query?.status
    const sortBy = req.query?.sortBy ? req.query.sortBy : ''
    const persistenceMethod = req.query?.persistenceMethod

    const errMessage = validateContentParams(statusFilter, sortBy, persistenceMethod)

    if (errMessage)
        res.status(400).send(errMessage)
    
    else {
        const where = {}

        if (statusFilter !== 'ALL')
            where.state = statusFilter

        todoLogger.info(`Extracting todos content. Filter: ${statusFilter} | Sorting by: ${sortBy ? sortBy: 'ID'}`)

        if (persistenceMethod === persistence.MONGO) {
            const totalAmountTodos = await getMongoRepo().count()

            getMongoRepo().find({ where: where }).then(todos => {
                todoLogger.debug(`There are a total of ${totalAmountTodos} todos in the system. The result holds ${todos.length} todos`)
                res.status(200).json({
                    result: todos.map(item => {
                        return {
                            id: item.rawid,
                            title: item.title,
                            content: item.content,
                            dueDate: item.duedate,
                            status: item.state
                        }
                    }).sort(getSortFunction(sortBy))
                })
            })
        }

        else {
            const totalAmountTodos = await getPostgresRepo().count()

            getPostgresRepo().findBy(where).then(todos => {
                todoLogger.debug(`There are a total of ${totalAmountTodos} todos in the system. The result holds ${todos.length} todos`)
                res.status(200).json({
                    result: todos.map(item => {
                        return {
                            id: item.rawid,
                            title: item.title,
                            content: item.content,
                            dueDate: item.duedate,
                            status: item.state
                        }
                    }).sort(getSortFunction(sortBy))
                })
            })
        }
    }
})

export default router