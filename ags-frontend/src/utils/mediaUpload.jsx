import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(url, key)

/**
 * Upload a media file to Supabase storage
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export function mediaUpload(file) {
    const mediaUploadPromise = new Promise((resolve, reject) => {
        if (file == null) {
            reject("No File Selected")
            return
        }

        const timeStamp = new Date().getTime()
        const newName = timeStamp + "-" + file.name

        supabase.storage.from("cbc-images").upload(newName, file, {
            upsert: true,
            cacheControl: "3600"
        }).then(() => {
            const publicUrl = supabase.storage.from("cbc-images").getPublicUrl(newName).data.publicUrl
            resolve(publicUrl)
        }).catch((error) => {
            console.error("Supabase upload error:", error)
            reject("Error occurred in Supabase connection")
        })
    })

    return mediaUploadPromise
}