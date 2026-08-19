// Βοηθητικά για εικόνες/thumbnails — χρησιμοποιούμε αποκλειστικά τα thumbnails
// που δίνει το ίδιο το YouTube (img.youtube.com), άρα καμία ζήτημα πνευματικών
// δικαιωμάτων — δεν φιλοξενούμε ξένες φωτογραφίες.

export function getYouTubeId(url) {
  if (!url) return null;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  return (watchMatch && watchMatch[1]) || (shortMatch && shortMatch[1]) || null;
}

export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// Επιλέγει το πιο αντιπροσωπευτικό βίντεο ενός τραγουδιού για thumbnail:
// πρώτα η πιο γνωστή εκτέλεση, μετά η πρώτη εκτέλεση, μετά η συνέντευξη.
export function getSongThumbnail(song) {
  const url =
    (song.famousPerformance && !song.famousPerformance.sameAsFirst
      ? song.famousPerformance.videoUrl
      : null) ||
    (song.firstPerformance ? song.firstPerformance.videoUrl : null) ||
    (song.interviewVideo ? song.interviewVideo.url : null);
  return getYouTubeThumbnail(url);
}
