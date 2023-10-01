package puppetdb

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/sebastianrakel/puppetviewer/config"
)

type client struct {
}

func NewClient() *client {
	return &client{}
}

func (c *client) call(httpMethod string, endpoint string, payload interface{}, query url.Values) (json.RawMessage, error) {
	cfg, err := config.GetConfig()
	if err != nil {
		return nil, err
	}

	uri := fmt.Sprintf("%s/%s", cfg.GetPuppetDbAddress(), endpoint)
	if query != nil {
		uri = fmt.Sprintf("%s?%s", uri, query.Encode())
	}

	var data []byte

	if payload != nil {
		data, err = json.Marshal(&payload)
		if err != nil {
			fmt.Printf("err: %s", err)
		}
	}

	req, err := http.NewRequest(httpMethod, uri, bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json; charset=UTF-8")

	httpClient := &http.Client{}

	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	responseData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusOK {
		rm := json.RawMessage{}
		err = rm.UnmarshalJSON(responseData)
		if err != nil {
			return nil, err
		}

		return rm, nil
	}

	return nil, fmt.Errorf(string(responseData))
}

func (c *client) Query(query string) (json.RawMessage, error) {
	type PuppetDbQueryRequest struct {
		Query string `json:"query"`
	}

	requestBody := PuppetDbQueryRequest{
		Query: query,
	}

	resp, err := c.call(http.MethodPost, "pdb/query/v4", &requestBody, nil)
	return resp, err
}

func (c *client) GetFactNames() (json.RawMessage, error) {
	resp, err := c.call(http.MethodGet, "pdb/query/v4/fact-names", nil, nil)
	return resp, err
}

func (c *client) GetEventCounts(query url.Values) (json.RawMessage, error) {
	resp, err := c.call(http.MethodGet, "pdb/query/v4/event-counts", nil, query)
	return resp, err
}
