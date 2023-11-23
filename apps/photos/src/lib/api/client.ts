import AlbumClientAPI from './album/client/album';
import ImageClientAPI from './image/client/image';
import ThumbnailClientAPI from './thumbnail/client/thumbnail';

export default class ClientAPI {
    static Album = AlbumClientAPI;
    static Image = ImageClientAPI;
    static Thumbnail = ThumbnailClientAPI;
}