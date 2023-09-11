'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Col, Form, Button, Row, Badge } from 'react-bootstrap'
import styles from '../page.module.css'
import { Category, KnowHowType, Tag } from '@prisma/client'
import { createKnowHowAction } from '@/app/actions/knowHowAction'
import FileUploader from '@/components/controls/fileUploader'
import { DropzoneOptions } from 'react-dropzone'
import { useSession, } from 'next-auth/react'
import { createTagAction } from '@/app/actions/tagAction'
import { useRouter } from 'next/navigation'

type RegProps = {
    categories: Category[],
    knowHowTypes: KnowHowType[],
    tags: Tag[],
}

const Registeration = ({ categories, knowHowTypes, tags }: RegProps) => {
    const { data: session } = useSession()
    const [validated, setValidated] = useState(false);
    const [file, setFile] = useState<File>()
    const [imgSrc, setImgSrc] = useState('')
    const [tagText, setTagText] = useState('')
    const [selectedTag, setTagSelected] = useState<Tag | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (selectedTag !== null) {
            var lastIndex = tagText.lastIndexOf(" ")
            let tx = tagText.substring(0, lastIndex)
            // console.log(lastIndex);
            if (lastIndex === -1) {
                tx = tx + selectedTag.name;
            } else {
                tx = tx + " " + selectedTag.name;
            }
            // setSpaceEntered(true)
            setTagText(tx)
            setTagSelected(null)
        }
    }, [selectedTag, tagText])

    const onDrop = useCallback(async (files: File[]) => {
        setFile(files[0])
        try {
            const data = new FormData()
            data.set('file', files[0])

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
            const imgUrl = `/images/${files[0].name}`;
            setImgSrc(imgUrl);
            if (!res.ok) throw new Error(await res.text())

        } catch (error) {
            console.log(error)
        }
    }, [])

    const options: DropzoneOptions = {
        accept: { 'image/*': [] }, maxSize: 1024 * 1000, maxFiles: 1, onDrop
    }

    const handleSubmit = async (e: any) => {

        try {
            if (!file) {
                alert('썸네일 이미지를 등록하세요')
                return
            }
            const form = e.currentTarget;
            const formData = new FormData(e.currentTarget);
            formData.set('thumNailImage', imgSrc)
            formData.set('authorId', session?.user.id)

            // const formDataObj = Object.fromEntries(formData.entries());
            // alert(JSON.stringify(formDataObj, null, 2))
            // alert(typeof formDataObj)

            if (form.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
            }
            createKnowHowAction(formData)
            setValidated(true);
            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    const createOrRemoveDuplicate = () => {
        const words = tagText.trim().split(" ");
        if (words.length > 1) {
            const last = tagText.trim().split(" ").pop() as string;
            var lastIndex = tagText.trim().lastIndexOf(" ");
            const tagTextBefore = tagText.trim().substring(0, lastIndex);
            const included = tagTextBefore.includes(last);
            if (included) {
                // alert(`${last} is already entered!`)
                setTagText(tagTextBefore)
            }
            else {
                // alert('tag Text: '+ tagText.toString())
                createTagAction(tagText);
            }
        }
        else {
            // alert('tag Text: '+ tagText.toString())
            createTagAction(tagText);
        }
    }

    const onTagKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.key === 'Enter' || e.key === ' ') {
            createOrRemoveDuplicate();
            router.push(`/regContents/?searchBy= `)
        }
        else {
            router.push(`/regContents/?searchBy=${tagText}`)
        }
    }
    const onBadgeClick = (tag: Tag) => {
        setTagSelected(tag);
    }
    const onTabKeyDown = ((e: React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key ==='Tab' && tags.length > 0){
            const firstTag = tags[0]
            setTagSelected(firstTag)
        }
    });

    return (<>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className='d-flex mt-3 gap-2'>
                <div className="card shadow p-3 mb-5 col-4" tabIndex={0}>
                    {file ? (
                        <div className='col-5 p-3'>
                            <Image
                                alt={file.name}
                                src={imgSrc}
                                quality={100}
                                fill
                                sizes="100vw"
                                style={{
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    ) : (<div>
                        <h3 className='text-center mt-3 mb-2'>  썸네일 이미지 등록 <b className={styles.redColor}>*</b></h3>
                        <div className={styles.upload}>
                            <FileUploader loaderMessage='썸네일 이미지를 끌어오거나 선택하세요 ' options={options} />
                        </div>
                    </div>)}

                </div>
                <div className="card shadow p-3 mb-5 col-7">
                    <Form.Group controlId="title" className='mb-3'>
                        <Row>
                            <Form.Label column="lg" lg={3}>
                                제목 <b className={styles.redColor}>*</b>
                            </Form.Label>
                            <Col>
                                <Form.Control size="lg" type="text" required placeholder="제목을 입력하세요" name='title' />
                                <Form.Control.Feedback type="invalid">
                                    제목을 입력하세요
                                </Form.Control.Feedback>
                            </Col>

                        </Row>
                    </Form.Group>
                    <Form.Group controlId="knowhowtype" className='mb-3'>
                        <Row>
                            <Form.Label column="lg" lg={3}>
                                경험유형  <b className={styles.redColor}>*</b>
                            </Form.Label>
                            <Col>
                                <Form.Select required aria-label="know how type select" name='knowHowTypeId' >
                                    <option value="">경험유형(필수)</option>
                                    {knowHowTypes.map(knowHowType => (
                                        <option key={knowHowType.id} value={knowHowType.id}>{knowHowType.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    경험유형을 선택하세요
                                </Form.Control.Feedback>
                            </Col>

                        </Row>
                    </Form.Group>
                    <Form.Group controlId="categorytype" className='mb-3'>
                        <Row>
                            <Form.Label column="lg" lg={3}>
                                카테고리  <b className={styles.redColor}>*</b>
                            </Form.Label>
                            <Col>
                                <Form.Select required as='select' name='categoryId' >
                                    <option value="">카테고리(필수)</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    카테고리를 선택하세요
                                </Form.Control.Feedback>
                            </Col>

                        </Row>
                    </Form.Group>
                    <Form.Group controlId="description" className='mb-3'>
                        <Row>
                            <Form.Label column="lg" lg={3}>
                                설명
                            </Form.Label>
                            <Col>
                                <Form.Control required name='description'
                                    as="textarea"
                                    placeholder="자세한 설명을 입력하세요"
                                    style={{ height: '100px' }}
                                />
                                <Form.Control.Feedback type="invalid" >
                                    자세한 설명을 입력하세요
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="tags" className='mb-3'>
                        <Row>
                            <Form.Label column="lg" lg={3}>
                                태그  <b className={styles.redColor}>*</b>
                            </Form.Label>
                            <Col>
                                <Form.Control size="lg" required type="text" placeholder="태그를 입력하세요" name='tags' value={tagText} onKeyDown={onTabKeyDown} onKeyUp={onTagKeyUp} onChange={e => setTagText(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    관련 태그를 입력하세요
                                </Form.Control.Feedback>
                            </Col>

                        </Row>
                        <Row>
                            <Form.Label column="lg" lg={3}>

                            </Form.Label>
                            <Col className='ms-1'>
                                {tags?.length > 0 ? <div className='bt-1 d-flex gap-1'>{
                                    tags?.map((t) => (
                                        <div className={`mt-1 ${styles.cursorHand}`} key={t.id}> <h6>
                                            <Badge onClick={e => onBadgeClick(t)} bg="info">{t.name}</Badge>
                                        </h6></div>
                                    ))
                                }</div> : <></>}
                            </Col>

                        </Row>

                    </Form.Group>
                </div>
            </div>
            <Button type="submit">저장</Button>
        </Form>
    </>
    )
}

export default Registeration