'use client';
import React, { useRef, useState } from 'react';

import { Category, KnowHowType, Tag } from '@prisma/client';
import { Button } from 'react-bootstrap';
import { RegiYoutube } from './regiYoutube';
import { RegiImages } from './regiImages';
import { RegiGeneral } from './regiGeneral';
import { createKnowHowWithYtAction } from '@/app/actions/knowHowAction';
import { RegiFiles } from './regiFiles';
import { RegImgTest } from './regImgTest';
import { RegiText } from './regiText';

type RegProps = {
    categories: Category[],
    knowHowTypes: KnowHowType[],
    tags: Tag[],
};

const Registeration = ({ categories, knowHowTypes, tags }: RegProps) => {
    const [detailInfo, setDetailInfo] = useState(false);
    const [genData, setGenData] = useState<FormData>();
    const [ytData, setYTData] = useState<any>();
    const [imgData, setImgData] = useState<any[]>([]);
    const [showYtData, setShowYtData] = useState(false);
    const regGenRef = useRef<CanHandleSubmit>(null);
    const ytRef = useRef<CanHandleSubmit>(null);
    const imgRef = useRef<CanHandleSubmit>(null);
    const fileRef = useRef<CanHandleSubmit>(null);

    const [showYoutube, setShowYoutube] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [showTextEditor, setShowTextEditor] = useState(false);

    const detailInfoBtnDesc = () => {
        if (detailInfo) return '세부사항 숨기기';
        else {
            return '세부사항 등록하기';
        }
    };

    const detailYTInfoBtnDesc = () => {
        if (detailInfo) return '유튜브 숨기기';
        else {
            return '유튜브 등록하기';
        }
    };


    const handleDetailInfoBtnClicke = () => {
        // alert('handleDetailInfoBtnClicke');
        // regGenRef.current?.handleSubmit();
        setDetailInfo(!detailInfo);
        setShowYtData(!showYtData);
        regGenRef.current?.handleSubmit();
        // if (!genData) {
        //     alert('제목등 상기 필수사항을 입력하세요');
        // }
        // setHideGenInfo(true);
        // console.log(hideGenInfo);
        // if (genData) {
        //     setDetailInfo(!detailInfo);
        // }

    };
    const setRegDataToSave = (name: string, data: any) => {
        // alert('set Gen Data ToSave ' + name + JSON.stringify(data));
        if (name === "regiGen") {
            setGenData(data);
        }
        else if (name === "ytData") {
            setYTData(data);
        }
        else if (name === "images") {
            setImgData(data);
        }
        // else if (name === "ytData") {
        //     setYTData(data);
        // }

        console.log('gen data:', genData);
        console.log('yt data:', ytData);
        console.log('gen image:', imgData);
    };
    const handleSaveBtnClick = () => {
        alert('handleSaveBtnClick');
        regGenRef.current?.handleSubmit();
        ytRef.current?.handleSubmit();
        imgRef.current?.handleSubmit();

        alert('ytData' + JSON.stringify(ytData));
        if (genData && ytData) {
            createKnowHowWithYtAction(genData, ytData);
        }
    };
    const handleCancelBtnClick = () => {

    };

    return (<>

        <RegiGeneral ref={regGenRef} categories={categories} knowHowTypes={knowHowTypes} tags={tags} setRegDataToSave={setRegDataToSave} />

        <div className='mt-3'>
            <button type="button" className="btn btn-success me-3" onClick={handleDetailInfoBtnClicke}>{detailInfoBtnDesc()}</button>
            <Button className='me-3' onClick={handleSaveBtnClick} type="submit">저장</Button>
            <Button className='btn btn-secondary' onClick={handleCancelBtnClick} type="submit">취소</Button>
        </div>

        {/* <button type="button" className="btn mt-3 btn-success" onClick={handleDetailInfoBtnClicke}>{detailInfoBtnDesc()}</button> */}

        {showYtData && (<>
            <div className='mt-2'>
                <p onClick={() => { setShowYoutube(!showYoutube); setShowImg(false); setShowFile(false); }}>유튜브 등록하기</p>
                <RegiYoutube ref={ytRef} setRegDataToSave={setRegDataToSave} showYtInput={showYoutube} />

            </div>
            <div className='mt-2'>
                <p onClick={() => { setShowImg(!showImg); setShowYoutube(false); setShowFile(false); }}>이미지 등록하기</p>
                <RegiImages ref={imgRef} setRegDataToSave={setRegDataToSave} showImg={showImg} />
            </div>
            <div className='mt-2'>
                <p onClick={() => { setShowFile(!showFile); setShowImg(false); setShowYoutube(false); }}>파일 등록하기</p>
                <RegiFiles ref={fileRef} setRegDataToSave={setRegDataToSave} showFileInput={showFile} />
            </div>
            <div className='mt-2'>
                <p onClick={() => { setShowTextEditor(!showTextEditor); setShowFile(false); setShowImg(false); setShowYoutube(false); }}>텍스트 등록하기</p>
                <RegiText ref={fileRef} setRegDataToSave={setRegDataToSave} showTextEditor={showTextEditor} />
            </div>
        </>
        )}

    </>
    );
};

export default Registeration;