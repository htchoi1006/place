'use client';
import { User, Vote, ThumbsSatus } from "@prisma/client";
import Card from "react-bootstrap/Card";
import { useRouter } from 'next/navigation';
import EyeFill from "./icons/eyeFill";
import Thumbup from "./icons/thumbUp";
import ThumbDown from "./icons/thumbDown";
import { getDaysFromToday } from "@/lib/dateTimeLib";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSession } from "next-auth/react";
import style from '@/app/page.module.css';
import Fork from "./icons/fork";
import { any } from "zod";
import { fork } from "child_process";
import { createVoteActionAndUpdateKnowHow } from "../actions/voteAction";

type KnowHowProps = {
    knowHow: any,
    logInUser?: User,
};

export type VoteData = Omit<Vote, "id">;

const KnowHowItem = (props: KnowHowProps) => {
    const { knowHow, logInUser } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const [thumbsStatus, setThumbsStatus] = useState<ThumbsSatus>(ThumbsSatus.None);
    const [forked, setforked] = useState(false);
    const [voter, setVoter] = useState<User>(session?.user);
    const [voteLoaded, setVoteLoaded] = useState<Vote>();
    const [voteChanged, setVoteChanged] = useState(false);

    const getVote = useCallback(() => {
        // console.log('getVote voter: ', voter);
        if (voter !== undefined) {
            // console.log('voter:', voter);
            const data = knowHow.votes.filter((s: { voterId: any; }) => s.voterId === voter.id)[0] as Vote;
            if (data) {
                // console.log('data:', data);
                setVoteLoaded(data);
                // setVoteToSave(data);
                setThumbsStatus(data.thumbsStatus);
                setforked(data.forked);
                setVoteChanged(false);
            }
        }
    }, [knowHow.votes, voter]);

    useLayoutEffect(() => {
        // console.log('session: ', session);
        setVoter(session?.user);
        // console.log('getVote');
        getVote();
    }, [getVote, session]);

    useEffect(() => {
        console.log('use effect: ', thumbsStatus, forked);
        console.log('initial vote: ', voteLoaded);
    }, [thumbsStatus, forked, voteLoaded]);

    const handleClickOnCard = (e: any) => {
        router.push(`/${props.knowHow?.id}`);
    };

    const checkLoginStatus = () => {
        if (!session) {
            alert('로그인을 하셔야 선택할 수 있습니다.');
            return false;
        }
        return true;
    };

    useLayoutEffect(() => {
        // console.log('vote Loaded: ', voteLoaded, thumbsStatus);
        // console.log('thumbsStatus: ', thumbsStatus);
        if (voteLoaded) {
            if (voteLoaded.forked !== forked || voteLoaded.thumbsStatus !== thumbsStatus) {
                // console.log('useLayoutEffect set voteChanged: ', thumbsStatus);
                setVoteChanged(true);
            }
        }
        // console.log('anyChange: ', voteChanged);
    }, [thumbsStatus, forked, voteLoaded, voteChanged]);

    useEffect(() => {
        // console.log('use Effect, voteChanged', voteChanged);
        if (voteChanged && voter !== null) {
            // console.log('do something here!!', thumbsStatus, forked, voter.id, knowHow.id);
            const voteToVote: VoteData = {
                thumbsStatus: thumbsStatus,
                forked: forked,
                knowHowId: knowHow.id,
                voterId: voter.id,
            };
            createVoteActionAndUpdateKnowHow(knowHow, voter, voteToVote);
        }
    }, [forked, knowHow, knowHow.id, thumbsStatus, voteChanged, voter]);

    const handleThumbUp = (e: any) => {
        if (checkLoginStatus()) {
            if (thumbsStatus === ThumbsSatus.None) {
                setThumbsStatus(ThumbsSatus.ThumbsUp);
                knowHow.thumbsUpCount++;
            } else if (thumbsStatus === ThumbsSatus.ThumbsDown) {
                setThumbsStatus(ThumbsSatus.ThumbsUp);
                knowHow.thumbsUpCount++;
                knowHow.thumbsDownCount--;
            } else if (thumbsStatus === ThumbsSatus.ThumbsUp) {
                setThumbsStatus(ThumbsSatus.None);
                knowHow.thumbsUpCount--;
            }
        }
    };

    const handleThumbDown = (e: any) => {
        if (checkLoginStatus()) {
            if (thumbsStatus === ThumbsSatus.None) {
                setThumbsStatus(ThumbsSatus.ThumbsDown);
                knowHow.thumbsDownCount++;

            } else if (thumbsStatus === ThumbsSatus.ThumbsDown) {
                setThumbsStatus(ThumbsSatus.None);
                knowHow.thumbsDownCount--;

            } else if (thumbsStatus === ThumbsSatus.ThumbsUp) {
                setThumbsStatus(ThumbsSatus.ThumbsDown);
                knowHow.thumbsDownCount++;
                knowHow.thumbsUpCount--;
            }
        }
    };

    const handleforked = (e: any) => {
        if (checkLoginStatus()) {
            if (forked === true) {
                setforked(false);
            }
            else {
                setforked(true);
            }
        }
    };

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
                                <Thumbup className={`ms-1 ${style.cursorHand}`} onClick={handleThumbUp} fill={thumbsStatus === ThumbsSatus.ThumbsUp ? "red" : ''} title="좋아요" />
                                <span className="ms-2 me-3">{knowHow.thumbsUpCount}</span>
                                <ThumbDown className={`ms-1 ${style.cursorHand}`} onClick={handleThumbDown} fill={thumbsStatus === ThumbsSatus.ThumbsDown ? "red" : ''} title="싫어요" />
                                <span className="ms-2 me-3">{knowHow.thumbsDownCount}</span>
                                <span className="mt-3">
                                    <Fork className={`ms-1 mt-1 ${style.cursorHand}`} onClick={handleforked} fill={forked ? "red" : ''} title="찜했어요" />
                                </span>
                            </span>
                        </small>
                    </Card.Footer>
                </Card>
            </div>
        </>
    );
};
export default KnowHowItem;