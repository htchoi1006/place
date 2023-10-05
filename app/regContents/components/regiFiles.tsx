'use client';
import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import styles from '../page.module.css';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import FileUploader from '@/components/controls/fileUploader';
import { getSignature, saveToDatabase } from '@/app/actions/cloudinary';

type FileProps = {
    showFileInput: boolean;
    setRegDataToSave: (name: string, data: any) => void;
};

export const RegiFiles = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {

    const { showFileInput, setRegDataToSave } = props;

    const [acceptedFiles, setAcceptedFiles] = useState<any[]>([]);
    const [fileRejections, setFileRejections] = useState<any[]>([]);
    const [pdfPublicIds, setPDFPublicIds] = useState<string[]>([])

    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                handlePost();
                setRegDataToSave('pdfPublicIds', pdfPublicIds);
            }
        }),
    );
    const handlePost = async () => {
        setPDFPublicIds([])
        acceptedFiles.forEach(file=> uploadToCloudinary(file));
    };
    const uploadToCloudinary = async (file:any) =>{
       
        if (!file) return;

        const { timestamp, signature } = await getSignature();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('folder', 'next');

        const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL as string;
        const data = await fetch(endpoint, {
            method: 'POST',
            body: formData
        }).then(res => res.json());
        await saveToDatabase({
            version: data?.version,
            signature: data?.signature,
            public_id: data?.public_id
        });
        setPDFPublicIds(prev => [...prev, data?.public_id])
    }
    const onDrop = useCallback((acceptedFiles: any[], fileRejections: any[]) => {
        console.log('accepted files:', acceptedFiles);
        setAcceptedFiles(previousFiles => [...previousFiles, ...acceptedFiles]);
        setFileRejections(previousRejections => [...previousRejections, ...fileRejections]);

    }, []);

    const options: DropzoneOptions = {
        accept: { '소스Url': ['*'], '피디에프': ['.pdf'] }, onDrop
    };

    const acceptedFileItems = acceptedFiles.map((file: any) => (
        <li className='list-group-item' key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }: { file: any, errors: any; }) => (
        <li className='list-group-item' key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));
    return (
        <>
            {showFileInput && (<div className={`border border-primary ${styles.inputDropNoBg}`}>
                <FileUploader loaderMessage='파일을 끌어다 놓거나 선택하세요 ' dropMessage='가져다가 여기 놓으세요' options={options} />
            </div>)}
            <aside>
                {acceptedFileItems.length > 0 && (<>
                    <ul className="list-group mb-3" >{acceptedFileItems}</ul>
                </>)}
                {fileRejectionItems.length > 0 && (<>
                    <h6>허용되지 않는 파일(들)입니다.</h6>
                    <ul className="list-group">{fileRejectionItems}</ul>
                </>)}


            </aside>


        </>
    );

});
RegiFiles.displayName = "RegiFiles"




