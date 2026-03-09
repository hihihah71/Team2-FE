import { z } from 'zod';

export const experienceSchema = z.object({
    id: z.number().or(z.string()),
    title: z.string().min(1, 'Vui lòng nhập chức danh'),
    company: z.string().min(1, 'Vui lòng nhập tên công ty'),
    date: z.string().min(1, 'Vui lòng nhập thời gian'),
    desc: z.string()
});

export const educationSchema = z.object({
    id: z.number().or(z.string()),
    title: z.string().min(1, 'Vui lòng nhập bằng cấp'),
    school: z.string().min(1, 'Vui lòng nhập tên trường'),
    date: z.string().min(1, 'Vui lòng nhập thời gian'),
    desc: z.string()
});

export const skillSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập kỹ năng'),
    level: z.string().optional()
});

export const personalInfoSchema = z.object({
    id: z.string(),
    isVerified: z.boolean().default(false),
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    role: z.string().min(2, 'Vui lòng nhập vị trí ứng tuyển'),
    dob: z.string(),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
    address: z.string(),
    summary: z.string(),
    avatarUrl: z.string().optional(),
    coverUrl: z.string().optional(),

    // Social Links
    linkedin: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
    github: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
    portfolio: z.string().url('URL không hợp lệ').optional().or(z.literal(''))
});

export const profileFormSchema = z.object({
    personalInfo: personalInfoSchema,
    skills: z.array(skillSchema),
    experiences: z.array(experienceSchema),
    educations: z.array(educationSchema),
    languages: z.array(skillSchema).optional() // Tái sử dụng skill schema cho language
});

export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
