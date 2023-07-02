package codersdk

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type GitAuth struct {
	Authenticated bool   `json:"authenticated"`
	Device        bool   `json:"device"`
	Type          string `json:"type"`

	// User is the user that authenticated with the provider.
	User *GitAuthUser `json:"user"`
	// AppInstallable is true if the request for app installs was successful.
	AppInstallable bool `json:"app_installable"`
	// AppInstallations are the installations that the user has access to.
	AppInstallations []GitAuthAppInstallation `json:"installations"`
	// AppInstallURL is the URL to install the app.
	AppInstallURL string `json:"app_install_url"`
}

type GitAuthAppInstallation struct {
	ID           int         `json:"id"`
	Account      GitAuthUser `json:"account"`
	ConfigureURL string      `json:"configure_url"`
}

type GitAuthUser struct {
	Login      string `json:"login"`
	AvatarURL  string `json:"avatar_url"`
	ProfileURL string `json:"profile_url"`
	Name       string `json:"name"`
}

// GitAuthDevice is the response from the device authorization endpoint.
// See: https://tools.ietf.org/html/rfc8628#section-3.2
type GitAuthDevice struct {
	DeviceCode      string `json:"device_code"`
	UserCode        string `json:"user_code"`
	VerificationURI string `json:"verification_uri"`
	ExpiresIn       int    `json:"expires_in"`
	Interval        int    `json:"interval"`
}

type GitAuthDeviceExchange struct {
	DeviceCode string `json:"device_code"`
}

type GitRepo struct {
	Name            string
	Description     string
	Owner           GitAuthUser
	URL             string
	StargazersCount int
	Language        string
	DefaultBranch   string
}

func (c *Client) GitAuthDeviceByID(ctx context.Context, provider string) (GitAuthDevice, error) {
	res, err := c.Request(ctx, http.MethodGet, fmt.Sprintf("/api/v2/gitauth/%s/device", provider), nil)
	if err != nil {
		return GitAuthDevice{}, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return GitAuthDevice{}, ReadBodyAsError(res)
	}
	var gitauth GitAuthDevice
	return gitauth, json.NewDecoder(res.Body).Decode(&gitauth)
}

// ExchangeGitAuth exchanges a device code for a git auth token.
func (c *Client) GitAuthDeviceExchange(ctx context.Context, provider string, req GitAuthDeviceExchange) error {
	res, err := c.Request(ctx, http.MethodPost, fmt.Sprintf("/api/v2/gitauth/%s/device", provider), req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusNoContent {
		return ReadBodyAsError(res)
	}
	return nil
}

// GitAuthByID returns the git auth for the given provider by ID.
func (c *Client) GitAuthByID(ctx context.Context, provider string) (GitAuth, error) {
	res, err := c.Request(ctx, http.MethodGet, fmt.Sprintf("/api/v2/gitauth/%s", provider), nil)
	if err != nil {
		return GitAuth{}, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return GitAuth{}, ReadBodyAsError(res)
	}
	var gitauth GitAuth
	return gitauth, json.NewDecoder(res.Body).Decode(&gitauth)
}

type GitReposOptions struct {
	// Default is 1.
	Page int
	// Default is 30. Max is 100.
	PerPage int

	// InstallationID is the ID of the installation to list repos for.
	// This is only used for GitHub.
	InstallationID int
}

type GitReposResponse struct {
	Total int       `json:"total"`
	Repos []GitRepo `json:"repos"`
}

// GitAuthReposByID lists the git repos for the given provider by ID.
func (c *Client) GitAuthReposByID(ctx context.Context, provider string, opts *GitReposOptions) (GitReposResponse, error) {
	if opts == nil {
		opts = &GitReposOptions{}
	}
	res, err := c.Request(ctx, http.MethodGet, fmt.Sprintf("/api/v2/gitauth/%s/repos", provider), nil, func(r *http.Request) {
		q := r.URL.Query()
		if opts.Page > 0 {
			q.Set("page", strconv.Itoa(opts.Page))
		}
		if opts.PerPage > 0 {
			q.Set("per_page", strconv.Itoa(opts.PerPage))
		}
		if opts.InstallationID > 0 {
			q.Set("installation_id", strconv.Itoa(opts.InstallationID))
		}
	})
	if err != nil {
		return GitReposResponse{}, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return GitReposResponse{}, ReadBodyAsError(res)
	}
	var repos GitReposResponse
	return repos, json.NewDecoder(res.Body).Decode(&repos)
}
