import { z } from "zod";

export const TaskScheme = z.object({
  title: z.string(),
  description: z.string(),
  status: z.boolean(),
});

export const validateTask = (input) => {
  return TaskScheme.safeParse(input);
};

export const validateTaskPartial = (input) => {
  return TaskScheme.partial().safeParse(input);
};
