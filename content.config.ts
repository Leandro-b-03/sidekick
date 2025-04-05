
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'data',
      source: 'books/*.md',
      schema: z.object({
        date: z.string()
      })
    })
  }
});