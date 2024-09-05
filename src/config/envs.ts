import "dotenv/config"
import * as joi from "joi"

interface EnvVars {
  PORT: number
  JWT_SECRET: string
  MONGODB_URI: string
}

const envSchema = joi.object({
  PORT: joi.number().required(),
  JWT_SECRET: joi.string().required(),
}).unknown(true)

const { error, value: envValues } = envSchema.validate(process.env)

if(error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envVars = envValues as EnvVars

export const envs = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  mongodbUri: envVars.MONGODB_URI
}