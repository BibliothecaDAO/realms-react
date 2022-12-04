import ListPlayer from 'listplayer';
import { useRef, useEffect, useState } from 'react';

export function usePlayer(playlist) {
  const player = useRef<ListPlayer>();
  const [currentTrack, setCurrentTrack] = useState('');

  // List player could be instantiated only at client side
  useEffect(() => {
    player.current = new ListPlayer({
      tracks: playlist,
      loopTracks: true,
      progressThroughTracks: true,
    });
    player.current.on('play', () => {
      setCurrentTrack(player.current.currentTrack.title);
    });
  }, [player]);

  return [player.current, currentTrack];
}
