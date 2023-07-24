import { IGHFileList } from "../model/IGHFileList";

class GHDownloader {
    getAllFiles(): Promise<IGHFileList> {
        return fetch("https://api.github.com/repos/Azure/review-checklists/git/trees/main?recursive=1")
            .then(response => response.json());
    }
}

const GHDownloaderInstance = new GHDownloader();

export default GHDownloaderInstance;