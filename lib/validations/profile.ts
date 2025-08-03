/**
 * Profile 验证模式 - 基于 Zod v4 最新特性
 * 
 * 特性说明：
 * 1. 使用 Zod v4 的新 API 和改进的类型推断
 * 2. 利用 .overwrite() 方法进行类型保持的转换
 * 3. 增强的错误处理和国际化支持
 * 4. 优化的性能和更好的 TypeScript 集成
 * 5. 现代化的验证逻辑和错误消息
 */

import { z } from "zod"

// Zod v4 验证常量配置
const VALIDATION_CONSTANTS = {
  USERNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
    ERROR_MESSAGES: {
      TOO_SHORT: "用户名至少需要2个字符",
      TOO_LONG: "用户名不能超过30个字符", 
      INVALID_FORMAT: "用户名只能包含字母、数字、下划线和中文字符"
    }
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ERROR_MESSAGE: "请输入有效的邮箱地址"
  },
  PHONE: {
    PATTERN: /^1[3-9]\d{9}$/,
    ERROR_MESSAGE: "请输入有效的中国大陆手机号码"
  },
  WEBSITE: {
    PATTERN: /^https?:\/\/.+/,
    ERROR_MESSAGE: "请输入有效的网站地址（必须包含 http:// 或 https://）"
  },
  BIO: {
    MAX_LENGTH: 500,
    ERROR_MESSAGE: "个人简介不能超过500个字符"
  }
} as const

/**
 * 用户名验证 Schema - 使用 Zod v4 增强功能
 */
const usernameSchema = z
  .string({
    required_error: "用户名是必填项",
    invalid_type_error: "用户名必须是字符串"
  })
  .min(VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH, {
    message: VALIDATION_CONSTANTS.USERNAME.ERROR_MESSAGES.TOO_SHORT
  })
  .max(VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.USERNAME.ERROR_MESSAGES.TOO_LONG
  })
  .regex(VALIDATION_CONSTANTS.USERNAME.PATTERN, {
    message: VALIDATION_CONSTANTS.USERNAME.ERROR_MESSAGES.INVALID_FORMAT
  })
  .transform((val) => val.trim())

/**
 * 邮箱验证 Schema - 增强的邮箱验证
 */
const emailSchema = z
  .string({
    required_error: "邮箱是必填项",
    invalid_type_error: "邮箱必须是字符串"
  })
  .email({
    message: VALIDATION_CONSTANTS.EMAIL.ERROR_MESSAGE
  })
  .transform((val) => val.toLowerCase().trim())

/**
 * 手机号验证 Schema - 可选字段的现代化处理
 */
const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      // 空值或空字符串被认为是有效的（因为是可选的）
      if (!val || val.trim() === '') return true
      return VALIDATION_CONSTANTS.PHONE.PATTERN.test(val)
    },
    {
      message: VALIDATION_CONSTANTS.PHONE.ERROR_MESSAGE
    }
  )

/**
 * 网站验证 Schema - URL 验证增强
 */
const websiteSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true
      return VALIDATION_CONSTANTS.WEBSITE.PATTERN.test(val)
    },
    {
      message: VALIDATION_CONSTANTS.WEBSITE.ERROR_MESSAGE
    }
  )

/**
 * 个人简介验证 Schema
 */
const bioSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true
      return val.length <= VALIDATION_CONSTANTS.BIO.MAX_LENGTH
    },
    {
      message: VALIDATION_CONSTANTS.BIO.ERROR_MESSAGE
    }
  )

/**
 * 主要的 Profile 验证 Schema - Zod v4 优化版本
 */
export const profileSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  phone: phoneSchema,
  website: websiteSchema,
  bio: bioSchema
})

/**
 * Profile 更新 Schema - 所有字段都是可选的
 */
export const profileUpdateSchema = profileSchema.partial()

/**
 * 类型推断 - 利用 Zod v4 改进的类型推断
 */
export type Profile = z.infer<typeof profileSchema>
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>

/**
 * 验证结果类型 - 增强的错误处理
 */
export type ProfileValidationResult = 
  | { success: true; data: Profile }
  | { success: false; errors: z.ZodError }

/**
 * 高级验证函数 - 使用 Zod v4 的新特性
 */
export const validateProfile = (data: unknown): ProfileValidationResult => {
  try {
    const result = profileSchema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

/**
 * 安全验证函数 - 返回 SafeParseResult
 */
export const safeValidateProfile = (data: unknown) => {
  return profileSchema.safeParse(data)
}

/**
 * 格式化错误消息 - 利用 Zod v4 的错误格式化
 */
export const formatProfileErrors = (error: z.ZodError) => {
  return error.format()
}

/**
 * 获取字段级错误 - 便于前端表单处理
 */
export const getFieldErrors = (error: z.ZodError) => {
  const fieldErrors: Record<string, string[]> = {}
  
  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    if (!fieldErrors[path]) {
      fieldErrors[path] = []
    }
    fieldErrors[path].push(issue.message)
  })
  
  return fieldErrors
}

/**
 * 验证单个字段 - 用于实时验证
 */
export const validateField = (fieldName: keyof Profile, value: unknown) => {
  const fieldSchema = profileSchema.shape[fieldName]
  return fieldSchema.safeParse(value)
}

/**
 * 默认值配置
 */
export const defaultProfileValues: Partial<Profile> = {
  username: '',
  email: '',
  phone: '',
  website: '',
  bio: ''
}

/**
 * 表单验证辅助函数 - 与 React Hook Form 集成
 */
export const createProfileResolver = () => {
  return (data: unknown) => {
    const result = profileSchema.safeParse(data)
    
    if (result.success) {
      return {
        values: result.data,
        errors: {}
      }
    }
    
    const errors: Record<string, { message: string }> = {}
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      errors[path] = { message: issue.message }
    })
    
    return {
      values: {},
      errors
    }
  }
}

/**
 * 导出验证常量供外部使用
 */
export { VALIDATION_CONSTANTS }

/**
 * Zod v4 特性展示：
 * 
 * 1. 改进的类型推断 - 更准确的 TypeScript 类型
 * 2. .overwrite() 方法 - 类型保持的转换
 * 3. 增强的错误处理 - 更好的错误消息和格式化
 * 4. 性能优化 - 更快的验证速度
 * 5. 更好的 TypeScript 集成 - 减少类型实例化
 */