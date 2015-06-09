interface FontFamilyUrls {
	"embedded-opentype": string;
	woff: string;
	truetype: string;
	svg: string;
}

interface FontManifest {
	[familyName: string]: FontFamilyUrls;
}

interface AnimationManifestItem {
	strip?: string;
	frames: number;
	msPerFrame: number;
	flip?: string;
	prefix?: string;
	suffix?: string;
	padNumberTo?: number;
	repeatAt?: number;
	rotate?: string;
}

interface AnimationManifest {
	[name: string]: AnimationManifestItem;
}

interface GameManifest {
	images: { [key: string]: string };
	sounds: { [key: string]: string };
	fonts: FontManifest;
	animations: AnimationManifest;
}
