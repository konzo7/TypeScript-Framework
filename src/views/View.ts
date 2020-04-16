import { Model } from '../models/Model';

/**The K on the right side is copypasted on the left :) */
export abstract class View<T extends Model<K>, K> {
	constructor(public parent: Element, public model: T) {
		this.bindModel();
	}

	abstract template(): string;

	bindModel = (): void => {
		this.model.on('change', () => {
			this.render();
		});
	};

	eventsMap = (): { [key: string]: () => void } => {
		return {};
	};

	bindEvents(fragement: DocumentFragment): void {
		const eventsMap = this.eventsMap();

		for (let eventKey in eventsMap) {
			const [ eventName, selector ] = eventKey.split(':');

			fragement.querySelectorAll(selector).forEach((element) => {
				element.addEventListener(eventName, eventsMap[eventKey]);
			});
		}
	}

	render(): void {
		this.parent.innerHTML = '';
		const templateElement = document.createElement('template');
		templateElement.innerHTML = this.template();

		this.bindEvents(templateElement.content);

		this.parent.append(templateElement.content);
	}
}