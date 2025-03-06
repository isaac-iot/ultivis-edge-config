import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Image } from "react-konva";
import { Button, useToast, useTranslation } from "@ultivis/library";

// TODO 추후 기준값 옵션으로 추가할예정
const adjustCoordinates = (x, y) => {
  // x, y 좌표가 0~1 범위 내에서 벗어나지 않도록 보정
  x = Math.min(Math.max(x, 0), 1);
  y = Math.min(Math.max(y, 0), 1);

  // 0.98 이상일 경우 1로, 0.02 이하일 경우 0으로 보정
  x = x >= 0.98 ? 1 : x <= 0.02 ? 0 : x;
  y = y >= 0.98 ? 1 : y <= 0.02 ? 0 : y;

  return [x, y];
};

const ImageEditor = ({ imageSrc, data, onUpdate }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 640, height: 640 });
  const [drawing, setDrawing] = useState(false);
  const [newPoints, setNewPoints] = useState([]); // 새로 그려지는 points
  const [selectedType, setSelectedType] = useState(data.type || "none");
  const { toast } = useToast();

  // 이미지 로드 및 비율 계산
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (imageSrc) {
      const img = new window.Image();
      img.src = imageSrc;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const newWidth = 640; // width는 고정
        const newHeight = newWidth / aspectRatio; // height는 비율에 맞춰서 조정

        setDimensions({
          width: 640,
          height: newHeight, // new_height 을 쓰면 비율에 높이를 맞춘 버전
        });
        setImage(img); // 이미지 상태 업데이트
      };
    }
  }, [imageSrc]);

  // 캔버스 크기 설정
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  // 정규화된 좌표를 실제 이미지 크기에 맞게 변환
  const denormalizePoints = (points) =>
    points.map(([x, y]) => [x * dimensions.width, y * dimensions.height]);

  // 실제 이미지 크기에 맞게 변환된 도형 좌표
  const normalizedPoints = data.points ? denormalizePoints(data.points) : [];

  // 포인트 반올림하여 소수점 2자리까지 처리
  const roundPoints = (points) =>
    points.map(([x, y]) => [
      Math.round(x * 100) / 100,
      Math.round(y * 100) / 100,
    ]);

  // 타입 변경 시 초기화
  useEffect(() => {
    setSelectedType(data.type || "none");
    setNewPoints([]); // 새 타입 변경 시 포인트 리셋
  }, [data.type]); // selectedType이 변경되면 실행

  // 마우스 액션 처리 (드로잉 시작)
  const handleMouseDown = (e) => {
    if (selectedType === "none") {
      toast({
        title: t(`Please select a type before drawing.`),
        duration: 3000,
        variant: "destructive",
      });

      return;
    }
    setDrawing(true);

    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    let normalizedStart = [
      pointer.x / dimensions.width,
      pointer.y / dimensions.height,
    ];
    // 조정된 좌표
    normalizedStart = adjustCoordinates(normalizedStart[0], normalizedStart[1]);

    setNewPoints((prevPoints) => [...prevPoints, normalizedStart]); // 첫 번째 점을 추가
  };

  // 마우스 움직임에 따른 포인트 업데이트 (폴리곤 그리기)
  const handleMouseMove = (e) => {
    if (!drawing || newPoints.length === 0) return;

    const stage = stageRef.current.getStage();
    const pointer = stage.getPointerPosition();
    let normalizedEnd = [
      pointer.x / dimensions.width,
      pointer.y / dimensions.height,
    ];

    // 조정된 좌표
    normalizedEnd = adjustCoordinates(normalizedEnd[0], normalizedEnd[1]);

    if (selectedType === "polygon") {
      setNewPoints((prev) => [...prev.slice(0, -1), normalizedEnd]); // 마지막 점만 업데이트
    } else {
      setNewPoints([newPoints[0], normalizedEnd]); // 시작점과 끝점을 업데이트
    }
  };

  // 마우스 업시 포인트를 currentData에 저장하고 drawing 끝냄
  const handleMouseUp = () => {
    if (selectedType === "polygon") {
      if (newPoints.length > 2) {
        // 폴리곤 그리기 완료 후 포인트 업데이트
        onUpdate({ ...data, points: roundPoints(newPoints) });
      }
      setDrawing(false); // 드로잉 끝내기
    } else {
      setDrawing(false);
      if (newPoints.length === 2) {
        // 새로 그려진 포인트를 currentData에 저장
        onUpdate({ ...data, points: roundPoints(newPoints) });
      }
      setNewPoints([]); // 드로잉 완료 후 초기화
    }
  };

  // 리셋 버튼 클릭 시 초기화
  const handleReset = () => {
    setNewPoints([]); // 새로 그린 points 리셋
    onUpdate({ ...data, points: [] }); // 전체 points 리셋
  };

  return (
    <div ref={containerRef} className="relative w-full bg-gray-200">
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {/* 배경 이미지 */}
          {image && (
            <Image
              image={image}
              width={dimensions.width}
              height={dimensions.height}
            />
          )}

          {/* 기존 ROI 도형 표시 */}
          {selectedType === "line" && normalizedPoints.length === 2 && (
            <Line
              points={normalizedPoints.flat()}
              stroke="red"
              strokeWidth={2}
            />
          )}
          {selectedType === "rectangle" && normalizedPoints.length === 2 && (
            <Rect
              x={normalizedPoints[0][0]}
              y={normalizedPoints[0][1]}
              width={Math.abs(normalizedPoints[1][0] - normalizedPoints[0][0])}
              height={Math.abs(normalizedPoints[1][1] - normalizedPoints[0][1])}
              stroke="blue"
              strokeWidth={2}
            />
          )}
          {selectedType === "polygon" && normalizedPoints.length > 2 && (
            <Line
              points={normalizedPoints.flat()}
              stroke="yellow"
              strokeWidth={2}
              closed
            />
          )}

          {/* 사용자가 그리는 도형 */}
          {newPoints.length === 2 && selectedType === "line" && (
            <Line
              points={denormalizePoints(newPoints).flat()}
              stroke="red"
              strokeWidth={2}
            />
          )}
          {newPoints.length === 2 && selectedType === "rectangle" && (
            <Rect
              x={denormalizePoints(newPoints)[0][0]}
              y={denormalizePoints(newPoints)[0][1]}
              width={Math.abs(
                denormalizePoints(newPoints)[1][0] -
                  denormalizePoints(newPoints)[0][0]
              )}
              height={Math.abs(
                denormalizePoints(newPoints)[1][1] -
                  denormalizePoints(newPoints)[0][1]
              )}
              stroke="blue"
              strokeWidth={2}
            />
          )}
          {newPoints.length > 2 && selectedType === "polygon" && (
            <Line
              points={denormalizePoints(newPoints).flat()}
              stroke="yellow"
              strokeWidth={2}
              closed
            />
          )}
        </Layer>
      </Stage>

      {/* Reset 버튼 */}
      <Button
        type="button"
        onClick={handleReset}
        className="absolute bottom-2 right-2 bg-red-500 text-white rounded"
      >
        {t("reset")}
      </Button>
    </div>
  );
};

export default ImageEditor;
