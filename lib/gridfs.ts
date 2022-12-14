import { Readable, Writable } from 'stream'
import getDb from './getDb'
import mongodb from 'mongodb'
import callOnce from "./callOnce"

export const getGridFsBucket = callOnce(async function () {
  return new mongodb.GridFSBucket(await getDb())
});

export async function saveString(filename: string, content: string, metadata = null) {
  await deleteByFilename(filename)
  const grid = await getGridFsBucket()
  await Readable.from(content).pipe(grid.openUploadStream(filename, { metadata: metadata }))
}

export async function getString(filename: string) {
  const grid = await getGridFsBucket()
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const s = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk)
        callback();
      }
    });
    s.on('finish', function () {
      const res = chunks.join()
      resolve(res)
    })
    grid.openDownloadStreamByName(filename).pipe(s)
  })
}

export async function getMetadata(filename: string) {
  const db = await getDb()
  return (await db.collection('fs.files').findOne({filename: filename}))?.metadata
}

export async function deleteByFilename(filename: string) {
  const grid = await getGridFsBucket()
  const db = await getDb()
  const filesColl = db.collection('fs.files')
  for (const file of (await filesColl.find({ filename: filename }).toArray())) {
    await grid.delete(file._id)
  }
}
