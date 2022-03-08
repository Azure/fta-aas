import { IGHFileList } from "../model/IGHFileList";

class GHDownloader {
    getAllFiles(): Promise<IGHFileList> {
        //TODO: The 'number' at the end is icky --> see if we can get this some other way
        //found this through: https://api.github.com/repos/Azure/review-checklists/git/trees/main?recursive=1
        return fetch("https://api.github.com/repos/Azure/review-checklists/git/trees/877912d9d244ef6095be72084d9aa8c343fb6817")
            .then(response => response.json());
    }
}

const ghDownloaderInstance = new GHDownloader();

export default ghDownloaderInstance;