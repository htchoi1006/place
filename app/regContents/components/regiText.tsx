'use client';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Modal } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parser from 'html-react-parser';

type FileProps = {
    showTextEditor: boolean;
    setRegDataToSave: (name: string, data: any) => void;
};

export const RegiText = forwardRef<CanHandleSubmit, FileProps>((props: FileProps, ref) => {

    const [data, setData] = useState<string>("");
    const { showTextEditor, setRegDataToSave } = props;
    const [showModal, setShowModal] = useState(false);
    const Editor = dynamic(() => import('@/components/controls/editor'), { ssr: false, });
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                setRegDataToSave('text', data);
            }
        }),
    );

    useEffect(() => {
        if (showTextEditor) {
            setShowModal(true);
        }
    }, [showTextEditor]);

    const handleTextChange = (data: string) => {
        console.log('editor textchanged:', data)
        setData(data)
    };

    const setMinHeight = (editor: any) => {
        editor.ui.view.editable.element.style.minHeight = "400px";
    };

    return (
        <>
            {showModal && (<Modal size='xl' show={showModal} dialogClassName="modal-90w modal-centered" onHide={() => setShowModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        세부 내역을 입력하세요
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CKEditor
                        editor={ClassicEditor}
                        data={data}
                        onReady={(editor: any) => {
                            setMinHeight(editor);
                        }}
                        onChange={(event, editor: any) => {
                            setMinHeight(editor);
                            const data = editor.getData();
                            setData(data);
                        }}
                        onBlur={(event, editor) => {

                            setMinHeight(editor);
                            console.log('Blur.', event);
                        }}
                        onFocus={(event, editor) => {
                            setMinHeight(editor);
                        }}
                    />
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowTextEditor(false)}>취소</Button>
                    <Button variant="primary" onClick={()=>handleSaveText}>저장</Button>
                </Modal.Footer> */}
            </Modal>)

            }

            {!showModal && (<div onClick={() => setShowModal(true)} >
                {data && (<p className='border rounded border-info p-3'>{parser(data)}</p>)}
            </div>)}

        </>
    );

});
RegiText.displayName = "RegiText";