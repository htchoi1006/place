'use client';
import React, { useRef, useState,  } from 'react';

import { Category, KnowHowDetailInfo, KnowHowType, Tag, ThumbnailType } from '@prisma/client';
import { Button,  } from 'react-bootstrap';
import { RegiYoutube } from './regiYoutube';
import { RegiImages } from './regiImages';
import { RegiGeneral } from './regiGeneral';
import { createKnowHowWithDetailAction } from '@/app/actions/knowHowAction';
import { RegiFiles } from './regiFiles';
import { RegiText } from './regiText';

type RegProps = {
    categories: Category[],
    knowHowTypes: KnowHowType[],
    tags: Tag[],
};

const Registeration = ({ categories, knowHowTypes, tags }: RegProps) => {
    const [showDetail, setShowDetail] = useState(false);
    const [detailInfo, setDetailInfo] = useState(false);
    const [genData, setGenData] = useState<FormData>();
    const [videoIds, setVideoIds] = useState<any>();
    const [imgPublicIds, setImgPublicIds] = useState<string[]>([]);
    const [pdfPublicIds, setPDFPublicIds] = useState<string[]>([]);
    const [text, setText] = useState('');

    const regGenRef = useRef<CanHandleSubmit>(null);
    const ytRef = useRef<CanHandleSubmit>(null);
    const imgRef = useRef<CanHandleSubmit>(null);
    const fileRef = useRef<CanHandleSubmit>(null);
    const textRef = useRef<CanHandleSubmit>(null);

    const [showYoutube, setShowYoutube] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [showTextEditor, setShowTextEditor] = useState(false);

    const setRegDataToSave = (name: string, data: any) => {
        if (name === "regiGen") {
            setGenData(data);
        }
        else if (name === "ytData") {
            console.log('youtube data:', data);
            setVideoIds(data);
        }
        else if (name === "imagePublicIds") {
            setImgPublicIds(data);
        }
        else if (name === "pdfPublicIds") {
            setPDFPublicIds(data);
        }
        else if (name === "text") {
            setText(data);
        }

    };
    const handleSaveBtnClick = () => {

        handleGet();
        if (genData) {
            const formDataObj = Object.fromEntries(genData.entries());
        }

        if (genData) {
            const knowhowDetailInfo: Omit<KnowHowDetailInfo, "id" | "knowHowId"> = {
                videoIds: videoIds,
                thumbnailType: ThumbnailType.MEDIUM,
                cloudinaryImgPublicIds: imgPublicIds,
                cloudinaryTextFilePublicIds: pdfPublicIds,
                detailText: text,
            };
            createKnowHowWithDetailAction(genData, knowhowDetailInfo);
        }
    };
    const getCloudinaryFilePublicIds = (files: any[]) => {
        return files.map(file => file.name);
    };

    const handleCancelBtnClick = () => {
        //delete from cloudinary
    };


    const handleGet = () => {
        regGenRef.current?.handleSubmit();
        ytRef.current?.handleSubmit();
        imgRef.current?.handleSubmit();
        fileRef.current?.handleSubmit();
        textRef.current?.handleSubmit();
    };
    return (
        <>
            <RegiGeneral ref={regGenRef} categories={categories} knowHowTypes={knowHowTypes} tags={tags} setRegDataToSave={setRegDataToSave} />
            <div className='mt-3'>
                <button type="button" className="btn btn-success me-3" onClick={() => { regGenRef.current?.handleSubmit(); setShowDetail(!showDetail); setShowYoutube(true); setShowImg(false); setShowFile(false); setShowTextEditor(false); }}>{showDetail ? (<div>세부사항 숨기기</div>) : (<div>세부사항 등록하기</div>)}</button>
                <Button className='me-3' onClick={handleSaveBtnClick} type="submit">저장</Button>
                <Button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</Button>
            </div>
            {showDetail && (
                <div>
                    <div className='mt-3'>
                        <p onClick={() => { handleGet(); setShowYoutube(!showYoutube); setShowImg(false); setShowFile(false); setShowTextEditor(false); }}>유튜브 등록하기</p>
                        <RegiYoutube ref={ytRef} setRegDataToSave={setRegDataToSave} showYtInput={showYoutube} />
                    </div>
                    <div className='mt-3'>
                        <p onClick={() => { handleGet(); setShowImg(!showImg); setShowYoutube(false); setShowFile(false); setShowTextEditor(false); }}>이미지 등록하기</p>
                        <RegiImages ref={imgRef} setRegDataToSave={setRegDataToSave} showImg={showImg} />
                    </div>
                    <div className='mt-3'>
                        <p onClick={() => { handleGet(); setShowFile(!showFile); setShowImg(false); setShowYoutube(false); setShowTextEditor(false); }}>PDF 파일 등록하기</p>
                        <RegiFiles ref={fileRef} setRegDataToSave={setRegDataToSave} showFileInput={showFile} />
                    </div>
                    <div className='mt-3'>
                        <p onClick={() => { handleGet(); setShowTextEditor(!showTextEditor); setShowFile(false); setShowImg(false); setShowYoutube(false); }}>텍스트와 이미지 등록하기</p>
                        <RegiText ref={textRef} setRegDataToSave={setRegDataToSave} showTextEditor={showTextEditor} />
                    </div>
                </div>)}
        </>
    );
};

export default Registeration;