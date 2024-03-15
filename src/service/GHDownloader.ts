import { IGHFileList } from "../model/IGHFileList";

class GHDownloader {
    async getAllFiles(): Promise<IGHFileList> {
        //TODO: The 'number' at the end is icky --> see if we can get this some other way
        //found this through: https://api.github.com/repos/Azure/review-checklists/git/trees/main?recursive=1
        //"path": "checklists"
        const response = await fetch('https://api.github.com/repos/Azure/review-checklists/commits?recursive=1');
        const data = await response.json();
        const gitTreeId = data[0]?.commit?.tree?.sha;
        return fetch("https://api.github.com/repos/Azure/review-checklists/git/trees/"+gitTreeId+"?recursive=1")
            .then(response => response.json());
    }
}
const GHDownloaderInstance = new GHDownloader();

export default GHDownloaderInstance;