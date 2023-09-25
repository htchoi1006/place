'use client';
import Image from 'next/image';
import React, { useCallback, useEffect, forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { Col, Form, Button, Row, Badge } from 'react-bootstrap';
import styles from '@/app/regContents/page.module.css';
import FileUploader from '@/components/controls/fileUploader';
import { DropzoneOptions } from 'react-dropzone';
import { useSession, } from 'next-auth/react';
import { createTagAction } from '@/app/actions/tagAction';
import { useRouter } from 'next/navigation';
import test from 'node:test';
import ImgUploader from '@/components/controls/imgUploader';
import Alert from 'react-bootstrap/Alert';
import { getSignature, saveToDatabase } from '@/app/actions/cloudinary';
import { JsonWebTokenError } from 'jsonwebtoken';

type RegProps = {
    setRegDataToSave: (name: string, data: any) => void;
};

export const RegImgTest = forwardRef<CanHandleSubmit, RegProps>((props: RegProps, ref) => {

    const { data: session } = useSession();
    const [file, setFile] = useState<any>();
    const [imgSrc, setImgSrc] = useState('');
    const [tagText, setTagText] = useState('');
    const [imgSrces, setImgSrces] = useState<string[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    const router = useRouter();

    const formRef = useRef<any>();
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {

            }
        }),
    );

    // useEffect(() => {
    //     // Revoke the data uris to avoid memory leaks
    //     return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    // }, [files]);

    // const onDrop = useCallback(async (files: File[]) => {
    //     const file = files[0];
    //     Object.assign(file, { preview: URL.createObjectURL(file) });

    //     console.log('file:', file);

    //     setFile(file);
    //     setFiles([...files, file]);

    //     try {

    //         const data = new FormData();
    //         console.log('file on Drop:', files[0].size);
    //         data.set('file', files[0]);
    //         const res = await fetch('/api/upload', {
    //             method: 'POST',
    //             body: data
    //         });
    //         if (!res.ok) throw new Error(await res.text());
    //         const imgUrl = `/images/${files[0].name}`;
    //         setImgSrc(imgUrl);
    //         setImgSrces([...imgSrces, imgUrl]);


    //     } catch (error) {
    //         alert('1024 * 1000 이내 파일을 올릴 수 있습니다.');
    //         // console.log('on drop error:',  error);
    //     }
    // }, [imgSrces]);

    const onDrop = useCallback((acceptedFiles:any[], rejectedFiles:any[]) => {
        console.log('accepted files:', acceptedFiles)
        if (acceptedFiles?.length) {
          setFiles(previousFiles => [...previousFiles, ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))]);
        }
    
        if (rejectedFiles?.length) {
        //   setRejected(previousFiles => [...previousFiles, ...rejectedFiles]);
        }
      }, []);

    const options: DropzoneOptions = {
        accept: { 'image/*': [] },  maxFiles: 1, onDrop
    };
    // const options: DropzoneOptions = {
    //     accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop
    // };

    const handleSort = () => {
        let _files = [...files];
        const draggedItemContent = _files.splice(dragItem.current, 1)[0];
        _files.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFiles(_files)
        // setImgSrces(_imgSrces);
    };
    const handleRemove = (indexToDelete: number) => {
        imgSrces.filter((img, i) => i !== indexToDelete);
    };

    const handlePost = async() =>{
        alert('handle post:')
        const file = files[0];
        if (!file) return;
    
        // get a signature using server action
        const { timestamp, signature } = await getSignature();

        alert('api_key:' + process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string)
    
        // upload to cloudinary using the signature
        const formData = new FormData();
    
        formData.append('file', file);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString() );
        formData.append('folder', 'next');
    
        const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL as string;
        const data = await fetch(endpoint, {
          method: 'POST',
          body: formData
        }).then(res => res.json());
    
        alert('post result:' + JSON.stringify(data,null,2))
        alert('data' + JSON.stringify(data, null, 2));
        // write to database using server actions
        await saveToDatabase({
          version: data?.version,
          signature: data?.signature,
          public_id: data?.public_id
        });
    }

    return (<>
        <div className={styles.inputDropNoBg}>
            <ImgUploader loaderMessage='썸네일 이미지를 끌어오거나 선택하세요 ' dropMessage='여기에 놓으세요...' options={options} />
        </div>
        <button type='button' className='btn btn-primary' onClick={handlePost}>Post Image to cloudinary</button>
        <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
            {files && (
                files.map((file, index) => (
                    <div
                        key={index}
                        className={styles.listItem}
                        draggable
                        onDragStart={(e) => (dragItem.current = index)}
                        onDragEnter={(e) => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <Alert variant="white" onClose={() => handleRemove(index)} dismissible>
                            <div className={`card ${styles.fillImage}`}>
                                <Image
                                    alt='test image'
                                    src={file.preview}
                                    quality={100}
                                    fill
                                    sizes="100vw"
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />

                            </div>
                        </Alert>
                    </div>
                ))
            )}
        </div>
      
    </>
    );
});

RegImgTest.displayName = "RegImgTest";
