import { useRef, useState } from 'react';
import { Card, CardContent, Dialog } from "@mui/material";

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import zhcnLocale from "@fullcalendar/core/locales/zh-cn";

import { Divider } from '../../../component/ScMui/ScMui';
import PageTitle from "../../../component/PageTitle/PageTitle";
import ExperimentalStyled from "./calendarStyled";
import CalendarToolbar from "./calendarToolbar";
import { reqGetEvents } from "../../../api/event";
import { getCurrentPerson } from '../pub/pubFunction';
import { GetCacheDocById } from '../../../storage/db/db';
import ViewEvent from './viewEvent';
import useContentHeight from '../../../hooks/useContentHeight';
import dayjs  from "../../../utils/myDayjs";

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <b>{" "}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

function Calendar() {
    const calendarRef = useRef(null);
    const [date, setDate] = useState(new Date());
    const [currentPerson, setCurrentPerson] = useState(getCurrentPerson());
    const [events, setEvents] = useState([]);
    const [duration, setDuration] = useState({ start: `${dayjs().weekday(0).format("YYYYMMDD")}0000`, end: `${dayjs().weekday(6).format("YYYYMMDD")}2359` });
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
        currentEvent: undefined,
    });
  
    const contentHeight = useContentHeight();


    //选择人员
    const handlePersonSelect = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        setCurrentPerson(value);
        handleRequesEvents(value, duration);
    };

    //更新区间
    const handleChangeDuration = async () => {
        const calendarEl = calendarRef.current;
        let newDuration = duration;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            newDuration = {
                start: dayjs(calendarApi.view.activeStart).format("YYYYMMDDHHmm"),
                end: dayjs(calendarApi.view.activeEnd).format("YYYYMMDDHHmm")
            };
        }
        setDuration(newDuration);
        handleRequesEvents(currentPerson, newDuration);
    };
    //向服务器获取数据
    const handleRequesEvents = async (person = currentPerson, dur = duration) => {
        let newEvents = [];
        if (person.id !== 0 && dur !== undefined) {
            const res = await reqGetEvents({ userid: person.id, start: dur.start, end: dur.end });
            if (res.data.status === 0) {
                if (res.data.data.resultnumber > 0) {
                    newEvents = res.data.data.events;
                }
            } 
        }
        setEvents(newEvents);
    }

    const handleViewChange = (newView) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.changeView(newView);
        }
        //修改日期
        handleChangeDuration();
    };

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
        //修改日期
        handleChangeDuration();
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.next();
            setDate(calendarApi.getDate());
        }
        //修改日期
        handleChangeDuration();
    };

    const handleDateToday = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.today();
            setDate(calendarApi.getDate());
        }
        //修改日期
        handleChangeDuration();
    };
    //对话框关闭
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            currentEvent: undefined,

        });
    };

    const handleEventSelect = async (arg) => {
        const eit = await GetCacheDocById("exectivetemplate", arg.event.extendedProps.eit.id);
        const eventDetail = {
            id: parseInt(arg.event.id),
            title: arg.event.title,
            sceneitem: arg.event.extendedProps.sceneitem,
            eit: eit,
            start: dayjs(arg.event.start).format("YYYYMMDDHHmm"),
            end: dayjs(arg.event.end).format("YYYYMMDDHHmm"),
            status: arg.event.extendedProps.status,
            billtype: arg.event.extendedProps.billtype,
            hid: arg.event.extendedProps.hid,
            billnumber: arg.event.extendedProps.billnumber,
            rownumber: arg.event.extendedProps.rownumber,
            hdescription: arg.event.extendedProps.hdescription,
            bdescription: arg.event.extendedProps.bdescription,
            createuser: arg.event.extendedProps.createuser,
            eidname: arg.event.extendedProps.eidname,
            eidvaluedisp: arg.event.extendedProps.eidvaluedisp,
            files: arg.event.extendedProps.files
        };

        setDiagStatus({
            isOpen: true,
            currentEvent: eventDetail,
        });
    };

    return (
        <>
            <PageTitle pageName="日程" displayHelp={true} helpUrl="/helps/calendarWeb" />
            <Divider my={2} />
            <Card mb={6} sx={{ mt: 2, height: contentHeight, width: "100%", overflow: "auto" }}>
                <ReactPerfectScrollbar>
                    <CardContent p={6}>
                        <ExperimentalStyled>
                            <CalendarToolbar
                                date={date}
                                onClickNext={handleDateNext}
                                onClickPrev={handleDatePrev}
                                onClickToday={handleDateToday}
                                onChangeView={handleViewChange}
                                onPersonChange={handlePersonSelect}
                                person={currentPerson}
                            />
                            <FullCalendar
                                weekends
                                editable={false}
                                droppable={false}
                                stickyHeaderDates
                                selectable
                                weekNumbers
                                ref={calendarRef}
                                locale={zhcnLocale}
                                events={events}
                                eventDisplay="block"
                                initialView="timeGridWeek"
                                initialDate={dayjs(new Date()).format("YYYY-MM-DD")}
                                eventContent={renderEventContent}
                                eventClick={handleEventSelect}
                                plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                                headerToolbar={false}
                            />
                        </ExperimentalStyled>
                    </CardContent>
                </ReactPerfectScrollbar>
            </Card>
            <Dialog
                open={diagStatus.isOpen}
                fullWidth
                maxWidth="md"
                onClose={handleDiagClose}
                closeAfterTransition={false}
            >
                <ViewEvent
                    currentEvent={diagStatus.currentEvent}
                    onCancel={handleDiagClose}
                />
            </Dialog>
        </>
    );
}
export default Calendar;


