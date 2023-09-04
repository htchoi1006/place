'use client'
import FileUploader from '@/components/controls/fileUploader'
import React, { useCallback } from 'react'
import { DropzoneOptions } from 'react-dropzone'

const Uploader = () => {
    const [file, setFile] = React.useState<File>()
  
    const onDrop = useCallback((files: File[]) => {
      setFile(files[0])
    }, [])
  
    const options: DropzoneOptions = {
      accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop
    }
    return (
      <>
        <FileUploader  className='m-5 border border-neutral-200 p-5' loaderMessage=' ' options={options} />
        <h5>선택된 파일명:</h5>
        {file?.name}
      </>
  
    )
  }

export default Uploader