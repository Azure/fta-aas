import { IGHFileList } from "../model/IGHFileList";

class GHDownloader {
    getAllFiles(): Promise<IGHFileList> {
        //TODO: The 'number' at the end is icky --> see if we can get this some other way
        //found this through: https://api.github.com/repos/Azure/review-checklists/git/trees/main?recursive=1
        return fetch("https://api.github.com/repos/Azure/review-checklists/git/trees/a068a9c66b559e668393306849bef9661d82f0fa")
            .then(response => response.json());
    }
}

const GHDownloaderInstance = new GHDownloader();

export default GHDownloaderInstance;