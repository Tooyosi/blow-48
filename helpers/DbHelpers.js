class DbHelpers {
    constructor(model, logger, failedStatus, successStatus, failureCode, successCode) {
        this.model = model
        this.logger = logger
        this.failedStatus = failedStatus
        this.successStatus = successStatus
        this.failureCode = failureCode
        this.successCode = successCode
    }


    async createNewInstance(table, params, res, Response) {
        let response
        try {
            let newModel = await this.model[table].create(params)
            response = new Response(this.successStatus, this.successStatus, this.successCode, newModel)
            return res.status(200).send(response)
        } catch (error) {
            this.logger.error(`Error while creating ${table} model: ${JSON.stringify(error)}`)
            response = new Response(this.failedStatus, this.failedStatus, this.failureCode, error.toString())
            return res.status(400).send(response)
        }
    }

    async editInstance(table, params, updateObj, res, Response) {
        let response
        try {
            let existingModel = await this.model[table].findOne(params)
            if (existingModel == null || existingModel == undefined) {
                response = new Response(this.failedStatus, `${table} not found`, this.failureCode, {})

                return res.status(404).send(response)
            }
            await existingModel.update(updateObj)
            response = new Response(this.successStatus, this.successStatus, this.successCode, existingModel)
            return res.status(200).send(response)
        } catch (error) {
            this.logger.error(`Error while creating ${table} model: ${JSON.stringify(error)}`)
            response = new Response(this.failedStatus, this.failedStatus, this.failureCode, error.toString())
            return res.status(400).send(response)
        }
    }

    async deleteInstance(table, params, res, Response) {
        let response
        try {
            let existingModel = await this.model[table].findOne(params)
            if (existingModel == null || existingModel == undefined) {
                response = new Response(this.failedStatus, `${table} not found`, this.failureCode, {})

                return res.status(404).send(response)
            }
            await existingModel.destroy()
            response = new Response(this.successStatus, this.successStatus, this.successCode, "Deleted")
            return res.status(200).send(response)
        } catch (error) {
            this.logger.error(`Error while creating ${table} model: ${JSON.stringify(error)}`)
            response = new Response(this.failedStatus, this.failedStatus, this.failureCode, error.toString())
            return res.status(400).send(response)
        }
    }

    async getPaginatedInstance(table, params, res, Response) {
        let response
        try {
            let allInstance = await this.model[table].findAndCountAll(params)
            response = new Response(this.successStatus, this.successStatus, this.successCode, allInstance)
            return res.status(200).send(response)
        } catch (error) {
            this.logger.error(`Error while creating ${table} model: ${JSON.stringify(error)}`)
            response = new Response(this.failedStatus, this.failedStatus, this.failureCode, error.toString())
            return res.status(400).send(response)
        }
    }

    async getAllInstance(table, params, res, Response) {
        let response
        try {
            let allInstance = await this.model[table].findAll(params)
            response = new Response(this.successStatus, this.successStatus, this.successCode, allInstance)
            return res.status(200).send(response)
        } catch (error) {
            this.logger.error(`Error while creating ${table} model: ${JSON.stringify(error)}`)
            response = new Response(this.failedStatus, this.failedStatus, this.failureCode, error.toString())
            return res.status(400).send(response)
        }
    }

    async getSingleInstance(table, params, res, Response) {
        let response
        try {
            let existingModel = await this.model[table].findOne(params)
            if (existingModel == null || existingModel == undefined) {
                response = new Response(this.failedStatus, `${table} not found`, this.failureCode, {})

                return res.status(404).send(response)
            }
            response = new Response(this.successStatus, this.successStatus, this.successCode, existingModel)
            return res.status(200).send(response)
        } catch (error) {
            this.logger.error(`Error while creating ${table} model: ${JSON.stringify(error)}`)
            response = new Response(this.failedStatus, this.failedStatus, this.failureCode, error.toString())
            return res.status(400).send(response)
        }
    }
}
module.exports = DbHelpers