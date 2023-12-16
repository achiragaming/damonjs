import { DamonJsTrack } from './DamonJsTrack';
import { DamonJsError } from '../../Modules/Interfaces';

export class DamonJsQueue extends Array<DamonJsTrack> {
  /** Get the size of queue */
  public get size() {
    return this.length;
  }

  /** Get the size of queue including current */
  public get totalSize(): number {
    return this.length + (this.current ? 1 : 0);
  }

  /** Check if the queue is empty or not */
  public get isEmpty() {
    return this.length === 0;
  }
  /** Check if the queue is ended or not */
  public get isEnd() {
    return this.length <= this.currentId + 1;
  }
  /** Get the queue's duration */
  public get durationLength() {
    return this.reduce((acc, cur) => acc + (cur.length || 0), 0);
  }

  /** Current playing trackId */
  public currentId: number = 0;

  /** Current playing track */
  public get current(): DamonJsTrack | undefined {
    return this.at(this.currentId);
  }
  /**
   * Add track(s) to the queue
   * @param track DamonJsTrack to add
   * @returns DamonJsQueue
   */
  public add(track: DamonJsTrack | DamonJsTrack[]): DamonJsQueue {
    if (Array.isArray(track) && track.some((t) => !(t instanceof DamonJsTrack)))
      throw new DamonJsError(1, 'Track must be an instance of DamonJsTrack');
    if (!Array.isArray(track) && !(track instanceof DamonJsTrack)) track = [track];

    if (Array.isArray(track)) for (const t of track) this.push(t);
    else this.push(track);
    // ; Array.isArray(track) ? this.push(...track) : this.push(track);
    return this;
  }

  /**
   * Remove track from the queue
   * @param position Position of the track
   * @returns DamonJsQueue
   */
  public remove(position: number): DamonJsQueue {
    if (position < 0 || position >= this.length)
      throw new DamonJsError(1, 'Position must be between 0 and ' + (this.length - 1));
    this.splice(position, 1);
    return this;
  }

  /** Shuffle the queue */
  public shuffle(): DamonJsQueue {
    const unplayedSongs = this.slice(this.currentId + 1); // Get unplayed songs after the current song

    for (let i = unplayedSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unplayedSongs[i], unplayedSongs[j]] = [unplayedSongs[j], unplayedSongs[i]];
    }

    // Reconstruct the queue with the shuffled unplayed songs after the current song
    const newQueue = [...this.slice(0, this.currentId + 1), ...unplayedSongs];
    this.splice(0, this.length, ...newQueue);

    return this;
  }
  /** Clear the queue */
  public clear(): DamonJsQueue {
    this.currentId = 0;
    this.splice(0, this.length);
    return this;
  }
}