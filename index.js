const autoCompleteConfig = {
	renderOption(serie) {
		const imgSrc = (serie.show.image) ? serie.show.image.medium : "http://placehold.it/300x400";
		return `
			<img src="${imgSrc}" />
			${serie.show.name}
			`;
	},
	inputValue(serie){
		return serie.show.name;
	},
	async fetchData(searchTerm){
		const response = await axios.get('http://api.tvmaze.com/search/shows?', {
			params: {
				q: searchTerm
			}
		});

		return response.data;
	}
};

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	onOptionSelect(serie){
	document.querySelector('.tutorial').classList.add('is-hidden');
	onSerieSelect(serie, document.querySelector('#left-summary'));
	}
});

createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	onOptionSelect(serie){
	document.querySelector('.tutorial').classList.add('is-hidden');
	onSerieSelect(serie, document.querySelector('#right-summary'));
	}
});

const onSerieSelect = async (serie, summaryElement) => {
	console.log(serie);
	if (serie.show.externals.tvrage) {
		searchSerieByDatabase('tvrage', serie.show.externals.tvrage, summaryElement);
	}else if(serie.show.externals.thetvdb){
		searchSerieByDatabase('thetvdb', serie.show.externals.thetvdb, summaryElement);
	}else if(serie.show.externals.imdb){
		searchSerieByDatabase('imdb', serie.show.externals.imdb, summaryElement);
	}else{
		summaryElement.innerHTML = "No data was found about the serie in any of the three databases";
	}


}

const searchSerieByDatabase = async (seriedatabase, serieId, outputElement) => {
	const data = {};
	data[seriedatabase] = serieId;
	const response = await axios.get('http://api.tvmaze.com/lookup/shows', {
			params: data
		});

	outputElement.innerHTML = serieTemplate(response.data);
}

const serieTemplate = (serieDetail) => {
	return `
	<article class="media">
		<figure class="media-left">
		<p class="image">
			<img src="${serieDetail.image.medium}" alt="" />
		</p>
		</figure>
		<div class="media-content">
			<div class="content">
				<h1>${serieDetail.name}</h1>
				<h4>Genre: ${serieDetail.genres.map(genre => genre).join(' | ')}</h4>
				${serieDetail.summary}
			</div>
		</div>
	</article>
	<article class="notification is-primary">
		<p class="title">${serieDetail.rating.average}</p>
		<p class="subtitle">Average Rating</p>
	</article>
	`;
}