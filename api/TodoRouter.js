import { Router, json } from 'express'
import {validateStatus, validateContentParams, validateTodoSchemaAndDetails} from '../validators/validators.js'
import { getSortFunction } from '../modules/helpers.js'
import todoLogger from '../logging/loggers/TodoLogger.js'
import {MONGO_CONNECTION, POSTGRES_CONNECTION} from "../db/connections.js";
import persistence from "../dicts/persistence.js";
import MongoTodoEntity from "../entity/mongo/MongoTodoEntity.js";
import PostgresTodoEntity from "../entity/postgres/PostgresTodoEntity.js";
import {getNextId} from "../modules/IdGenerator.js";
import todoSchema from "../entity/TodoSchema.js";
import status from "../dicts/status.js";

const router = Router()
router.use(json())

router.get('/health', (req, res) => {
    res.status(200).send('OK')
})

router.post('/', async (req, res) => {
    const id = getNextId()
    const { error, value } = todoSchema.validate({ rawid: id, state: status.PENDING, ...req.body})
    const todos = await MONGO_CONNECTION.getRepository(MongoTodoEntity).find()
    const validateTodoErrMessage = validateTodoSchemaAndDetails({ error, value, todos })

    if (!validateTodoErrMessage) {
        todoLogger.info(`Creating new TODO with Title [${req.body.title}]`)
        todoLogger.debug(`Currently there are ${await MONGO_CONNECTION.getRepository(MongoTodoEntity).count()} Todos in the system. New TODO will be assigned with id ${id}`)

        await MONGO_CONNECTION.getRepository(MongoTodoEntity).save(value)
        await POSTGRES_CONNECTION.getRepository(MongoTodoEntity).save(value)

        res.status(200).json({result: id})
    }

    else
        res.status(409).json({errorMessage: validateTodoErrMessage})
})

router.put('/', (req, res) => {
    // const id = req.query?.id
    // const newStatus = req.query?.status
    //
    // todoLogger.info(`Update TODO id [${id}] state to ${newStatus}`)
    //
    // const { todo, oldStatusString } = validateUpdateParams({todos, id, newStatus, res})
    //
    // if (todo) {
    //     todoLogger.debug(`Todo id [${id}] state change: ${oldStatusString} --> ${newStatus}`)
    //     todo.status = status[newStatus]
    //
    //     res.status(200).json({result: oldStatusString})
    // }
})

router.delete('/', async (req, res) => {
    const id = req.query?.id

    if (!id)
        res.status(400).send('Invalid id')

    else {
        todoLogger.info(`Removing todo id ${id}`)
        const todosAmountBeforeRemoval = await MONGO_CONNECTION.getRepository(MongoTodoEntity).count()
        await MONGO_CONNECTION.getRepository(MongoTodoEntity).delete({ rawid: parseInt(id) })
        await POSTGRES_CONNECTION.getRepository(PostgresTodoEntity).delete({ rawid: parseInt(id) })
        const todosAmountAfterRemoval = await MONGO_CONNECTION.getRepository(MongoTodoEntity).count()

        if (todosAmountBeforeRemoval < todosAmountAfterRemoval) {
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
            MONGO_CONNECTION.getRepository(MongoTodoEntity).countBy(where).then(amount => {
                todoLogger.info(`Total TODOs count for state ${statusFilter} is ${amount}`)
                res.status(200).json({ result: amount })
            })
        }

        else {
            POSTGRES_CONNECTION.getRepository(MongoTodoEntity).countBy(where).then(amount => {
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
            const totalAmountTodos = await MONGO_CONNECTION.getRepository(MongoTodoEntity).count()

            MONGO_CONNECTION.getRepository(MongoTodoEntity).find(where).then(todos => {
                todoLogger.debug(`There are a total of ${totalAmountTodos} todos in the system. The result holds ${todos.length} todos`)
                res.status(200).json({
                    result: todos.sort(getSortFunction(sortBy))
                                    .map(element => {
                                        delete element._id
                                        return element
                                    })})
            })
        }

        else {
            const totalAmountTodos = await POSTGRES_CONNECTION.getRepository(PostgresTodoEntity).count()

            POSTGRES_CONNECTION.getRepository(PostgresTodoEntity).find(where).then(todos => {
                todoLogger.debug(`There are a total of ${totalAmountTodos} todos in the system. The result holds ${todos.length} todos`)
                res.status(200).json({
                    result: todos.sort(getSortFunction(sortBy))
                        .map(element => {
                            delete element._id
                            return element
                        })})
            })
        }
    }
})

export default router