'use client';
import React, { useEffect, useRef, useState, } from 'react';

import { Category, Knowhow, KnowhowDetailInfo, KnowhowType, Tag, ThumbnailType } from '@prisma/client';
import { DispYoutube } from './dispYoutube';
import { DispImages } from './dispImages';
import { createKnowHowWithDetailAction, updateKnowHowAction } from '@/app/actions/knowhowAction';
import { DispText } from './dispText';
import DispGeneral from './dispGeneral';
import { DispPdfFiles } from './dispPdfFiles';

type RegProps = {
    knowhow: any | Knowhow,
};

const KnowhowDetails = ({ knowhow }: RegProps) => {

    return (
        <>
            <DispGeneral knowhow={knowhow} />
            <DispYoutube videoIds={knowhow?.knowhowDetailInfo?.videoIds} thumbnailType="medium" />
            <DispImages imgFileNames={knowhow?.knowhowDetailInfo?.imgFileNames} />
            <DispPdfFiles pdfFileNames={knowhow?.knowhowDetailInfo?.pdfFileNames} />
            <DispText detailText={knowhow?.knowhowDetailInfo?.detailText} />
        </>
    );
};

export default KnowhowDetails;