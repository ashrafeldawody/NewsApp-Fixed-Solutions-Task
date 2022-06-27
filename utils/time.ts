
export function secondsPassedSince(time:string):number {
    let now = new Date();
    let end = new Date(time);
    let diff = now.getTime() - end.getTime();
    return Math.floor(diff / 1000);
}