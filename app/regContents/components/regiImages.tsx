'use client';
import Image from 'next/image';
import React, { useCallback, forwardRef, useState, useImperativeHandle, useRef } from 'react';
import styles from '@/app/regContents/page.module.css';
import { DropzoneOptions } from 'react-dropzone';
import ImgUploader from '@/components/controls/imgUploader';
import Alert from 'react-bootstrap/Alert';
import { getSignature, saveToDatabase } from '@/app/actions/cloudinary';

type RegProps = {
    showImg: boolean;
    setRegDataToSave: (name: string, data: any) => void;
};

export const RegiImages = forwardRef<CanHandleSubmit, RegProps>((props: RegProps, ref) => {
    console.log('rendering started');

    const { showImg, setRegDataToSave } = props;
    const [files, setFiles] = useState<any[]>([]);
    const [imgPublicIds, setImgPublicIds] = useState<string[]>([])
    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);
    const formRef = useRef<any>();

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                handlePost();
                setRegDataToSave('imagePublicIds', imgPublicIds);
            }
        }),
    );

    const onDrop = useCallback((acceptedFiles: any[], rejectedFiles: any[]) => {
        if (acceptedFiles?.length) {
            setFiles(previousFiles => [...previousFiles, ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))]);
        }
        if (rejectedFiles?.length) {
        }
    }, []);

    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, maxFiles: 1, onDrop
    };

    const handleSort = () => {
        let _files = [...files];
        const draggedItemContent = _files.splice(dragItem.current, 1)[0];
        _files.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFiles(_files);
    };
    const handleRemove = (indexToDelete: number) => {
        setFiles(files.filter((file, i) => i !== indexToDelete));
    };
    const handlePost = async () => {
        setImgPublicIds([])
        files.forEach(file=> uploadToCloudinary(file));
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
        setImgPublicIds(prev => [...prev, data?.public_id])
    }

   
    return (<>
        {showImg && (<div className={`border border-primary ${styles.inputDropNoBg}`}>
            <ImgUploader loaderMessage='이미지를 끌어오거나 선택하세요 ' dropMessage='여기에 놓으세요...' options={options} showUploadIcon={false} />
        </div>)}

        <div className='row row-cols-1 row-cols-md-3 row-cols-sm-3 mt-0 gap-0'>
            {files && (
                files.map((file, index) => (
                    <div key={index} className={styles.listItem} draggable onDragStart={(e) => (dragItem.current = index)} onDragEnter={(e) => (dragOverItem.current = index)}
                        onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}                    >
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

RegiImages.displayName = "RegiImages";
