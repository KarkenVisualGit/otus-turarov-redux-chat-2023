import { getMessagesList, ServerResponse, config } from "../chat";

global.fetch = jest.fn();

describe("getMessagesList", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("fetches messages and returns a list of messages", async () => {
		const fakeResponse: ServerResponse = {
			"1": {
				id: "1",
				nickname: "Test User",
				message: "Hello",
				date: new Date(),
			},
		};

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			json: () => Promise.resolve(fakeResponse),
		});

		const result = await getMessagesList();

		expect(global.fetch).toHaveBeenCalledWith(
			`${config.firebaseBaseUrl}/${config.firebaseCollection}`,
			{
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			}
		);

		expect(result).toEqual(
			Object.values(fakeResponse).map((el) => ({
				...el,
				date: new Date(el.date || Date.now()),
			}))
		);
	});
});
