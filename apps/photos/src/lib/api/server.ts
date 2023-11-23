import AlbumServerAPI from './album/server/album';
import ImageServerAPI from './image/server/image';
import ThumbnailServerAPI from './thumbnail/server/thumbnail';

export default class ServerAPI {
    static Album = AlbumServerAPI;
    static Image = ImageServerAPI;
    static Thumbnail = ThumbnailServerAPI;
}