import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Observer} from "rxjs/Observer";

@Injectable()
export class WebSocketService {
	private subject: Subject<MessageEvent>;
	private subjectData: Subject<number>;
	private ws: any;
	private wsCreate: any
	// For chat box
	public connect(url: string): Subject<MessageEvent> {
		if (!this.subject) {
			this.subject = this.create(url);
		}
		return this.subject;
	}

	private create(url: string): Subject<MessageEvent> {
		this.ws = new WebSocket(url);

		let observable = Observable.create(
			(obs: Observer<MessageEvent>) => {
				this.ws.onmessage = obs.next.bind(obs);
				this.ws.onerror   = obs.error.bind(obs);
				this.ws.onclose   = obs.complete.bind(obs);

				return this.ws.close.bind(this.ws);
			});

		let observer = {
			next: (data: Object) => {
				if (this.ws.readyState === WebSocket.OPEN) {
					this.ws.send(JSON.stringify(data));
				}
			}
		};

		return Subject.create(observer, observable);
  	}
	
	public close() {
	    console.log('on closing WS');
	    this.ws.close()
	    this.subject = null
	  }

	// For random numbers
	public connectData(url: string): Subject<number> {
		if (!this.subjectData) {
			this.subjectData = this.createData(url);
		}
		return this.subjectData;
	}

	private createData(url: string): Subject<number> {
		this.wsCreate = new WebSocket(url);

		let observable = Observable.create(
			(obs: Observer<number>) => {
				ws.onmessage = obs.next.bind(obs);
				ws.onerror   = obs.error.bind(obs);
				ws.onclose   = obs.complete.bind(obs);

				return this.wsCreate.close.bind(this.wsCreate);
			});

		let observer = {
			next: (data: Object) => {
				if (this.wsCreate.readyState === WebSocket.OPEN) {
					this.wsCreate.send(JSON.stringify(data));
				}
			}
		};

		return Subject.create(observer, observable);
	}
	
	public closeData() {
	    console.log('on closing WS');
	    this.wsCreate.close()
	    this.subjectData = null
	  }
} // end class WebSocketService
