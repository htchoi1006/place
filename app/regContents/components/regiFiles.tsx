'use client';
import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import styles from '../page.module.css';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import FileUploader from '@/components/controls/fileUploader';

type FileProps = {
    showFileInput: boolean;
    setRegDataToSave: (name: string, data: any) => void;
};

export const RegiFiles = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {

    const { showFileInput, setRegDataToSave } = props;

    const [acceptedFiles, setAcceptedFiles] = useState<any[]>([]);
    const [fileRejections, setFileRejections] = useState<any[]>([]);

    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                alert('handleSubmit');
                setRegDataToSave('file', acceptedFiles)
            }
        }),
    );
    const onDrop = useCallback((acceptedFiles: any[], fileRejections: any[]) => {
        console.log('accepted files:', acceptedFiles);
        setAcceptedFiles(previousFiles => [...previousFiles, ...acceptedFiles]);
        setFileRejections(previousRejections => [...previousRejections, ...fileRejections]);

    }, []);

    const options: DropzoneOptions = {
        accept: { '소스Url': ['*'], '피디에프': ['.pdf'], '파워포인트': ['.pptx'], 'word': ['.docx'] }, onDrop
    };

    const acceptedFileItems = acceptedFiles.map((file: any) => (
        <li className='list-group-item' key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }: { file: any, errors: any; }) => (
        <li className='list-group-item' key={file.path}>
            {file.path} - {file.size} bytes
            <ul className="list-group">
                {errors.map((e: any) => (
                    <li className='list-group-item' key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));
    return (
        <>
            {showFileInput && (<div className={`border border-primary ${styles.inputDropNoBg}`}>
                <FileUploader loaderMessage='파일을 끌어다 놓거나 선택하세요 ' dropMessage='가져다가 여기 놓으세요' options={options} />
            </div>)}
            {/* <div className={`border border-primary ${styles.inputDropNoBg}`}>
                <div className={`border border-primary ${styles.inputDropNoBg}`}>
                    <FileUploader loaderMessage='파일을 끌어다 놓거나 선택하세요 ' dropMessage='가져다가 여기 놓으세요' options={options} />
                </div>

            </div> */}



            <aside>
                {acceptedFileItems.length > 0 && (<>
                    <h4>Accepted files</h4>
                    <ul className="list-group" >{acceptedFileItems}</ul>)
                </>)}
                {fileRejectionItems.length > 0 && (<>
                    <h4>Rejected files</h4>
                    <ul className="list-group">{fileRejectionItems}</ul>
                </>)}


            </aside>


        </>
    );

});
RegiFiles.displayName = "RegiFiles"




