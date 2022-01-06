import { FunctionalComponent, h } from '@stencil/core';

interface TwitProps {
    data: any;
}

export const Twit: FunctionalComponent<TwitProps> = ({ data }) => (
    <li class="twit" data-id={data.IDStr}>
        <img class="avatar" title={ data.User.Name } src={ data.User.ProfileImageURLHttps } />
        <div class="body">
            <div class="user">
                <div>{ data.User.Name }</div>
                { data.User.Verified ?
                <div class="verified"></div>
                : null }
                <div class="handler">@{ data.User.ScreenName }</div>
            </div>
            <div class="msg">{ data.Text }</div>
            <div class="time">{ data.CreatedAt }</div>
            { data.Source ?
            <div class="source">
                <span>Source:</span>
                <span innerHTML={ data.Source }></span>
            </div>
            : null }
        </div>
    </li>
);
