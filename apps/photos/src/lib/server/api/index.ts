import AlbumServerAPI from './album';
import ImageServerAPI from './image';
import ThumbnailServerAPI from './thumbnail';

export default class ServerAPI {
    static Album = AlbumServerAPI;
    static Thumbnail = ThumbnailServerAPI;
    static Image = ImageServerAPI;
}
