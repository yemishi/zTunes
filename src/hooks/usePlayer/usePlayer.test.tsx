import { renderHook, act, waitFor } from "@testing-library/react";

import { usePlayerContext } from "@/context/Provider";
import { useSession } from "next-auth/react";
import usePlayer from "./usePlayer";

jest.mock("@/context/Provider", () => ({
  usePlayerContext: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe("usePlayer", () => {
  const mockSetCurrSong = jest.fn();
  let audioMock: any;

  let paused = true;

  beforeEach(() => {
    paused = true;

    audioMock = {
      play: jest.fn(() => {
        paused = false;
      }),
      pause: jest.fn(() => {
        paused = true;
      }),
      get paused() {
        return paused;
      },
      currentTime: 0,
      volume: 1,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    global.Audio = jest.fn(() => audioMock);

    (usePlayerContext as jest.Mock).mockReturnValue({
      currSong: 0,
      setCurrSong: mockSetCurrSong,
      player: ["song1", "song2", "song3"],
    });

    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Zal" } },
    });
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => usePlayer());

    expect(result.current.currentTime).toBe(0);
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.volume).toBe(1);
    expect(typeof result.current.togglePlayer).toBe("function");
  });
  it("should toggle play/pause correctly", () => {
    const { result } = renderHook(() => usePlayer());

    expect(result.current.isPlaying).toBe(true);
    act(() => {
      result.current.togglePlayer();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it("should call setCurrSong when next is called", () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.next();
    });

    expect(mockSetCurrSong).toHaveBeenCalledWith(1);
  });

  it("should not go next if at end of playlist", () => {
    (usePlayerContext as jest.Mock).mockReturnValue({
      currSong: 2,
      setCurrSong: mockSetCurrSong,
      player: ["song1", "song2", "song3"],
    });

    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.next();
    });

    expect(mockSetCurrSong).toHaveBeenCalledWith(2);
  });

  it("should call setCurrSong when previous is called", () => {
    (usePlayerContext as jest.Mock).mockReturnValue({
      currSong: 1,
      setCurrSong: mockSetCurrSong,
      player: ["song1", "song2", "song3"],
    });

    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.previous();
    });

    expect(mockSetCurrSong).toHaveBeenCalledWith(0);
  });

  it("should update volume when handleVolume is called", () => {
    const { result } = renderHook(() => usePlayer());
    result.current.audioRef.current = { volume: 1 } as unknown as HTMLAudioElement;

    const mockEvent = {
      target: { value: "0.5" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleVolume(mockEvent);
    });

    expect(result.current.volume).toBe(0.5);
  });

  it("should update currentTime when handleProgress is called", () => {
    const { result } = renderHook(() => usePlayer());
    result.current.audioRef.current = { currentTime: 0 } as unknown as HTMLAudioElement;
    const mockEvent = {
      target: { value: "30" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleProgress(mockEvent);
    });

    expect(result.current.currentTime).toBe(30);
  });

  it("should return current song info", () => {
    const { result } = renderHook(() => usePlayer());
    expect(result.current.song).toBe("song1");
  });
});
