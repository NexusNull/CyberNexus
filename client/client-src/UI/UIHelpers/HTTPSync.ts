import {BaseFileSystem, FileSystem} from "browserfs/dist/node/core/file_system";
import {BFSCallback, BFSOneArgCallback} from "browserfs/src/core/file_system";
import Stats from "browserfs/src/core/node_fs_stats";
import {FileFlag} from "browserfs/dist/node/core/file_flag";
import {File} from "browserfs/src/core/file";

class HTTPSync extends BaseFileSystem implements FileSystem {
    getName(): string {
        return "HTTPSync";
    }

    isReadOnly(): boolean {
        return false;
    }

    supportsLinks(): boolean {
        return false;
    }

    supportsProps(): boolean {
        return false;
    }

    supportsSynch(): boolean {
        return false;
    }
    rename(oldPath: string, newPath: string, cb: BFSOneArgCallback): void{

    }
    stat(p: string, isLstat: boolean | null, cb: BFSCallback<Stats>): void{

    }
    open(p: string, flag: FileFlag, mode: number, cb: BFSCallback<File>): void{

    }
    unlink(p: string, cb: BFSOneArgCallback): void{

    }
}