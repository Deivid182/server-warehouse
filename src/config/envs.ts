import "dotenv/config"
import * as joi from "joi"

interface EnvVars {
  PORT: number
}

const envSchema = joi.object({
  PORT: joi.number().required(),
}).unknown(true)

const { error, value: envValues } = envSchema.validate(process.env)

if(error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envVars = envValues as EnvVars

export const envs = {
  port: envVars.PORT,
}