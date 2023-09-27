import { UploadButton, UploadDropzone } from "@uploadthing/react"
import type { OurFileRouter } from "~/server/uploadthing/router"

export const UploadFile = () => (
  <>
    <div className="flex flex-col items-center justify-center gap-4">
      <span className="text-center font-bold">
        {`Upload a file using a button:`}
      </span>

      <UploadButton<OurFileRouter>
        endpoint="withoutMdwr"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res)
          alert("Upload Completed")
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`)
        }}
      />
    </div>
    <div className="flex flex-col items-center justify-center gap-4">
      <span className="text-center font-bold">{`...or using a dropzone:`}</span>
      <UploadDropzone<OurFileRouter>
        endpoint="withMdwr"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res)
          alert("Upload Completed")
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`)
        }}
      />
    </div>
  </>
)
