import { z } from "zod"

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "姓名至少需要2个字符")
    .max(50, "姓名不能超过50个字符")
    .regex(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, "姓名只能包含中文、英文和空格"),
  
  email: z
    .string()
    .email("请输入有效的邮箱地址")
    .max(100, "邮箱地址不能超过100个字符"),
  
  bio: z
    .string()
    .max(500, "个人简介不能超过500个字符")
    .optional(),
  
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码")
    .optional()
    .or(z.literal("")),
  
  location: z
    .string()
    .max(100, "所在地不能超过100个字符")
    .optional(),
  
  website: z
    .string()
    .url("请输入有效的网站地址")
    .optional()
    .or(z.literal("")),
  
  avatar: z
    .string()
    .optional()
})

export type ProfileFormData = z.infer<typeof profileSchema>