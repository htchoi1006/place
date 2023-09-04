'use client'
import { KnowHow, User, Vote, ThumbsSatus } from "@prisma/client";
import Card from "react-bootstrap/Card";
import { useRouter } from 'next/navigation'
import EyeFill from "./icons/eyeFill";
import Thumbup from "./icons/thumbUp";
import ThumbUpFill from "./icons/thumbUpFill";
import ThumbDown from "./icons/thumbDown";
import ThumbDownFill from "./icons/thumbDownFill";
import { getDaysFromToday } from "@/lib/dateTimeLib";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import style from '@/app/page.module.css'
import { createVoteActionAndUpdateKnowHow } from "../actions/voteAction";

type KnowHowProps = {
    knowHow: any,
    logInUser?: User,
}

const KnowHowItem = (props: KnowHowProps) => {

    const { knowHow, logInUser } = props
    const { data: session } = useSession()
    const router = useRouter();
    const [thumbsUp, setThumbsUp] = useState(false)
    const [thumbsDown, setThumbsDown] = useState(false)
    const [voteFormData] = useState<FormData>(new FormData())
    const [vt, setVote] = useState<Vote>();

    const getVote = useCallback(() => {
        const v = knowHow.votes.filter((s: { voterId: any; }) => s.voterId === session?.user.id)[0];
        setVote(v);
    }, [knowHow, session?.user.id]);

    useEffect(() => {
        getVote();
    }, [getVote, session])

    useEffect(() => {
        // alert('currentVote: ' + JSON.stringify(vt, null, 2))
        if (logInUser) {
            voteFormData.set("voterId", logInUser.id);
        }
        if (vt?.thumbsStatus === ThumbsSatus.ThumbsUp) {
            setThumbsUp(true);
        }
        if (vt?.thumbsStatus === ThumbsSatus.ThumbsDown) {
            setThumbsDown(true);
        }
        if (thumbsUp && !thumbsDown) {
            voteFormData.set("thumbsStatus", ThumbsSatus.ThumbsUp)
        }
        else if (thumbsDown && !thumbsUp) {
            voteFormData.set("thumbsStatus", ThumbsSatus.ThumbsDown)
        }
        else {
            voteFormData.set("thumbsStatus", ThumbsSatus.None)
        }

        createVoteActionAndUpdateKnowHow(knowHow, session?.user, voteFormData)

    }, [knowHow, logInUser, session?.user, thumbsDown, thumbsUp, voteFormData, vt, vt?.thumbsStatus])

    const handleClickOnCard = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        router.push(`/${props.knowHow?.id}`)
    }

    const checkLoginStatus = () => {
        if (!session) {
            alert('로그인을 하셔야 선택할 수 있습니다.')
            return false;
        }
        return true
    }

    const handleThumbUp = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (checkLoginStatus()) {
            if (thumbsDown) {
                knowHow.thumbsDownCount--;
            }
            setThumbsUp(true)
            setThumbsDown(false)
            knowHow.thumbsUpCount++;
        }
    }
    const handleThumbUpFill = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setThumbsUp(false)
        setThumbsDown(false)
        knowHow.thumbsUpCount--;
    }
    const handleThumbDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (checkLoginStatus()) {
            if (thumbsUp) {
                knowHow.thumbsUpCount--;
            }
            setThumbsDown(true)
            setThumbsUp(false)
            knowHow.thumbsDownCount++;
        }
    }
    const handleThumbDownFill = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setThumbsDown(!thumbsDown)
        setThumbsUp(false)
        knowHow.thumbsDownCount--;
    }

    return (
        <>
            <div key={knowHow?.id} className='col-sm'>
                <Card className='card shadow-lg p-1 bg-body rounded h-100' >
                    <Card.Img onClick={(e) => handleClickOnCard(e)} variant="top" src={props.knowHow?.thumNailImage as string} sizes="100vw" height={250} style={{ objectFit: 'contain', }} />
                    <Card.Body onClick={handleClickOnCard} >
                        <Card.Title className='text-center fw-bold'>{props.knowHow?.title}</Card.Title>
                        <Card.Text className='text-center card-text'>
                            {props.knowHow?.description}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-center" >
                        <small className="text-muted"> {getDaysFromToday(props.knowHow?.updatedAt as Date)} 일전
                            <EyeFill className='ms-3 me-2' />
                            <span>{props.knowHow?.viewCount}</span>
                            <span className="ms-3">
                                {thumbsUp ? <ThumbUpFill className={`ms-1 ${style.cursorHand}`} onClick={handleThumbUpFill} /> : <Thumbup className={`ms-1 ${style.cursorHand}`} onClick={handleThumbUp} />}
                                <span className="ms-2 me-3">{knowHow.thumbsUpCount}</span>
                                {thumbsDown ? <ThumbDownFill className={`ms-1 ${style.cursorHand}`} onClick={handleThumbDownFill} /> : <ThumbDown className={`ms-1 ${style.cursorHand}`} onClick={handleThumbDown} />}
                                <span className="ms-2 me-3">{knowHow.thumbsDownCount}</span>
                            </span>
                        </small>
                    </Card.Footer>
                </Card>
            </div>
        </>
    )
}
export default KnowHowItem