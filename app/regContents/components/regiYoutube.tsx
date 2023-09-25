'use client';
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import { YoutubeInfo, YoutubeApiInfo, getYoutubeData } from '../lib/convert';
import { ThumbnailType, YoutubeData } from '@prisma/client';
import { Alert } from 'react-bootstrap';

type YTProps = {
  showYtInput:boolean;
  setRegDataToSave: (name: string, data: any) => void;
};

export const RegiYoutube = forwardRef<CanHandleSubmit, YTProps>((props: YTProps, ref) => {

  const {showYtInput, setRegDataToSave } = props;
  const [embedUrl, setEmbedUrl] = useState('');
  const [url, setUrl] = useState<string>('');
  const [ytdata, setYtData] = useState<YoutubeInfo[]>([]);
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);


  useImperativeHandle(
    ref,
    () => ({
      handleSubmit() {
        alert('handleSubmit');
        const yd = getYtData();
        alert('yd data' + JSON.stringify(yd, null, 2));
        setRegDataToSave('ytData', yd);
        // handleSubmit(formRef.current)
        // console.log('ref', formRef);
      }
    }),
  );

  const getYtData = () => {
    // alert('getYtData' + JSON.stringify(ytdata,null,2))
    const ytd: Pick<YoutubeData, "videoIds" | "thumbnailType"> = {
      videoIds: ytdata.map(s => s.videoId),
      thumbnailType: ThumbnailType.MEDIUM,
    };
    // alert('videoIds' + JSON.stringify(ytd,null,2))
    return ytd;
  };

  const handleInputChange = async (e: any) => {
    try {
      const url = e.target.value;
      if (url === ' ') {
        return;
      }
      const yd = await getYoutubeData(url) as YoutubeInfo;
      if (yd) {
        setYtData([...ytdata, yd]);
      }
    } catch (error) {
      console.log('handle input changed error');
    }
  };

  const handleSort = () => {
    let _ytdata = [...ytdata];
    const draggedItemContent = _ytdata.splice(dragItem.current, 1)[0];
    _ytdata.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setYtData(_ytdata);
  };

  const handleHide = () => {
    setEmbedUrl('');
  };

  const handleImageClick = (url: string) => {
    setEmbedUrl(url);
    // setEmbedUrl(url);
  };

  const handleRemove = (indexToDelete: number) => {
    setYtData(ytdata.filter((file, i) => i !== indexToDelete));
    //setFiles(files.filter((file, i) => i !== indexToDelete));
    // alert('files:' + JSON.stringify(files, null, 2));
    // handleSort();
  };

  return (
    <>
      {showYtInput && (<input className={`border border-primary ${styles.inputDropYt}`}
        value={url}
        type="text"
        name="fruitName"
        placeholder="유튜브를 끌어오세요"
        onChange={handleInputChange}
      />)}

      <div>
        {embedUrl ?
          <div>
            <div ><button className='btn btn-primary-outline' type="button" onClick={handleHide}>회면 숨기기</button></div>
            <iframe src={embedUrl} width={854} height={480} title="YouTube video player" allowFullScreen></iframe>
          </div>
          : <div></div>}

      </div>
      <div className='row row-cols-1 row-cols-md-3 row-cols-sm-2 mt-0 g-3'>
        {ytdata.map((item, index) => (
          <div key={index} className={styles.listItem} draggable
            onDragStart={(e) => (dragItem.current = index)} onDragEnter={(e) => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}          >
            <Alert variant="white" onClose={() => handleRemove(index)} dismissible>
              <Image src={item.thumbnails.medium.url} width={item.thumbnails.medium.width} height={item.thumbnails.medium.height} alt={item.videoId} onClick={(e) => handleImageClick(item.embedUrl)} />
            </Alert>
          </div>
        ))}
      </div>
    </>
  );

});
RegiYoutube.displayName = "RegiYoutube"




