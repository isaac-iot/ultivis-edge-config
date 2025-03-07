import Hls from "hls.js";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  useTranslation,
  Button,
  Loading,
} from "@ultivis/library";
import { useAppApi } from "../apis/useAppApi";
const VideoModal = ({ id, isOpen, onClose, url, protocol }) => {
  const { t } = useTranslation();
  const { getStream, closeStream } = useAppApi();
  const videoRef = useRef(null);
  const [status, setStatus] = useState({ loading: true, exist: true });
  const [streamUrl, setStreamUrl] = useState("");

  useEffect(() => {
    if (isOpen && url && protocol) {
      const fetchStream = async () => {
        setStatus({ loading: true, exist: false });
        try {
          const data = await getStream(id, url, protocol);
          // 일정 시간 대기 후 streamUrl을 설정
          setTimeout(() => {
            setStreamUrl(data.stream_url);
            setStatus({ loading: false, exist: true });
          }, 3000); // 초 대기 후 URL 설정
        } catch (error) {
          console.error("Error fetching stream:", error);
          setStatus({ loading: false, exist: false });
        }
      };

      fetchStream();
    }
  }, [isOpen, url, protocol, id, getStream]);

  useEffect(() => {
    if (!streamUrl) {
      setStatus({ loading: false, exist: false }); // URL이 없는 경우
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStatus({ loading: false, exist: true }); // 스트리밍 준비 완료
      });
      hls.on(Hls.Events.ERROR, () => {
        setStatus({ loading: false, exist: false }); // 스트리밍 실패
      });
      return () => {
        hls.destroy(); // 컴포넌트 언마운트 시 HLS 정리
      };
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
      videoRef.current.addEventListener("loadeddata", () => {
        setStatus({ loading: false, exist: true }); // 스트리밍 준비 완료
      });
      videoRef.current.addEventListener("error", () => {
        setStatus({ loading: false, exist: false }); // 스트리밍 실패
      });
    }
  }, [streamUrl]);

  // Cleanup
  const handleClose = async () => {
    // todo 아래 try-catch는 강제로 close ffmpeg 프로세스 하는 것
    try {
      await closeStream();
      console.log("Stream closed successfully");
    } catch (error) {
      console.error("Error closing stream:", error);
    }

    if (onClose) {
      onClose(); // Ensure onClose is called to close the modal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-[45rem]">
        <DialogHeader>
          <DialogTitle>{t(`video stream`)}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full overflow-hidden min-h-[20em]">
          {status.loading && <Loading />}
          {!status.loading && !status.exist && (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center text-lg text-gray-700">
              {t(`No Video Available`)}
            </div>
          )}
          {status.exist && !status.loading && (
            <video ref={videoRef} controls autoPlay muted />
          )}
        </div>
        <DialogFooter>
          <Button variant="destructive" type="button" onClick={handleClose}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
