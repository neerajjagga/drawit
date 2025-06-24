"use client";

import * as LucideIcons from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toolsConfig } from "../lib/config/toolsConfig";
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "next/navigation";

export default function Home() {
  // check roomId in query
  const searchParams = useSearchParams();
  const room = searchParams.get('room');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [lastPoint, setLastPoint] = useState<{ prev: { x: number, y: number }, curr: { x: number, y: number } } | null>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [activeTool, setActiveTool] = useState<string>('pen');

  const [isSharePopupEnabled, setIsSharePopupEnabled] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(room);
  // const [isStartingSession, setIsStartingSession] = useState<boolean>(false);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return

    // ctx.fillStyle = 'white';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(roomId ? `ws://localhost:8080/?room=${roomId}` : "ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("websocket connected");
    }

    ws.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);

      if (parsedData.points && ctxRef.current) {
        const ctx = ctxRef.current;
        ctx.beginPath();
        ctx.moveTo(parsedData.points.prev.x, parsedData.points.prev.y);
        ctx.lineTo(parsedData.points.curr.x, parsedData.points.curr.y);
        ctx.stroke();
      }

      if (parsedData.type === "room_joined") {
        const { roomId, message } = parsedData;
        if (!roomId) return;

        setRoomId(roomId);
      }
    };

    return () => {
      ws.current?.close();
    }
  }, [roomId]);

  useEffect(() => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !lastPoint) return;

    ws.current.send(JSON.stringify({
      type: "line",
      roomId,
      points: lastPoint,
    }));
  }, [lastPoint]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setLastPoint({ prev: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }, curr: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } });
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!lastPoint || !ctxRef.current) return;

    const ctx = ctxRef.current!;
    const newPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }

    ctx.beginPath();
    ctx.moveTo(lastPoint.curr.x, lastPoint.curr.y);
    ctx.lineTo(newPoint.x, newPoint.y);
    ctx.stroke();

    setLastPoint({ prev: { x: lastPoint.curr.x, y: lastPoint.curr.y }, curr: { x: newPoint.x, y: newPoint.y } });
  }

  const handleMouseUp = () => {
    setLastPoint(null);
  }

  const handleStartSession = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    const roomId = uuidv4();

    ws.current.send(JSON.stringify({
      type: "join_room",
      roomId,
    }));
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-gray-200"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.2) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-10 ${activeTool === "pen" ? "cursor-copy" : "cursor-crosshair"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      <div className="bg-white absolute left-4 top-1/2 -translate-y-1/2 text-gray-800 px-1 py-1 rounded-sm z-50 border-b-2 border-r-2">
        <div className="flex flex-col gap-1">
          {toolsConfig.map(tool => {
            switch (tool.type) {

              case "single": {
                const Icon = LucideIcons[tool.icon as keyof typeof LucideIcons]
                return <div key={tool.id} className={`w-12 h-12 flex justify-center items-center rounded-lg ${activeTool === tool.id ? "bg-blue-100/70 text-blue-600" : "hover:bg-blue-100/70"}`} >
                  {/* @ts-ignore */}
                  {Icon && <button><Icon size={25} /></button>}
                </div>
              }

              // case "multi": {
              //   const Icon = LucideIcons[tool.icon as keyof typeof LucideIcons]
              //   return <div key={tool.id} className="w-12 h-12 flex justify-center items-center rounded-lg hover:bg-blue-100/70">
              //     <button>
              //       {/* @ts-ignore */}
              //       {Icon && <Icon size={25} />}
              //     </button>
              //   </div>
              // }

              case "switchable": {
                const activeIconData = tool.icons?.[tool.activeIndex || 0];
                const ActiveIcon = activeIconData
                  ? LucideIcons[activeIconData.icon as keyof typeof LucideIcons]
                  : null;
                return <div key={tool.id} className={`w-12 h-12 flex justify-center items-center rounded-lg ${activeTool === tool.id ? "bg-blue-100/70 text-blue-600" : "hover:bg-blue-100/70"}`}>
                  {/* @ts-ignore */}
                  {ActiveIcon && <ActiveIcon size={22} />}
                </div>
              }

              default: return null
            }
          })}
        </div>
      </div>

      {/* share btn */}
      <div className="z-50 absolute top-4 right-6">
        <button
          onClick={() => setIsSharePopupEnabled(true)}
          className="bg-blue-600 px-4 py-2 rounded-lg">Share</button>
      </div>

      {isSharePopupEnabled && (
        <div className="h-screen w-full flex items-center justify-center">

          {/* popup */}
          <div className="z-50 max-w-md mx-auto mt-10 rounded-xl bg-blue-700/20 px-6 py-5 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-blue-500">Live collaboration</h2>
            <p className="mt-2 text-sm text-gray-600">
              Invite people to collaborate on your drawing.
            </p>
            <button
              onClick={handleStartSession}
              className="mt-4 rounded-md bg-blue-500/90 px-4 py-2 text-sm font-medium text-white transition cursor-pointer">
              ▶ Start session
            </button>

            {roomId && (
              <div>
                <input type="text" readOnly value={roomId} />
                <button onClick={() => window.navigator.clipboard.writeText(`http:localhost:3001?room=${roomId}`)}>Copy <LucideIcons.Copy /> </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}