import { getServerSession } from "next-auth"
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy"
import { authOptions } from "../auth"

const f = createUploadthing()

export const uploadRouter = {
  withMdwr: f
    .fileTypes(["image"])
    .maxSize("16MB")
    .middleware(async (req, res) => {
      const auth = await getServerSession(req, res, authOptions)

      console.log("auth:", auth)

      return {
        userEmail: auth?.user?.email,
        // otherProperty: "hello" as const,
      }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("uploaded with the following metadata:", metadata)

      console.log(`${metadata?.userEmail as string}  successfully uploaded file:`, file)
      file
      // ^?
    }),

  withoutMdwr: f
    // eslint-disable-next-line @typescript-eslint/require-await
    .middleware(async () => {
      return { testMetadata: "lol" }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("uploaded with the following metadata:", metadata)
      metadata
      // ^?

      console.log("files successfully uploaded:", file)
      file
      // ^?
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter