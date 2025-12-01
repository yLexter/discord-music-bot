import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  ButtonStyle,
  CommandInteraction,
} from "discord.js";
import { pagination } from "../enums/index";
import { Utils } from "./Utils";
import { Song } from "./Songs";

export class SongsPagination {
  public firstPage = 1;
  public currentPag = 1;
  public oneSecondInMs = 1000;
  public title: string;
  public interaction: CommandInteraction;
  public amountPerPage: number;
  public finishCommand: number;
  public firstSongIsHeader: number;

  public hearder?: () => string;
  public songs: () => Song[];

  constructor(options) {
    this.title = options.title;
    this.interaction = options.interaction;
    this.amountPerPage = options.amountPerPage || 10;
    this.finishCommand = options.finishCommand || 120;
    this.firstSongIsHeader = options.firstSongIsHeader ? 1 : 0;
    this.hearder = options.hearder;
    this.songs = options.songs;
  }

  getTotalPages() {
    const songs = this.songs();
    const length = songs.length + this.firstSongIsHeader;
    return length < this.amountPerPage
      ? 1
      : Math.ceil(length / this.amountPerPage);
  }

  getFormattedDuration() {
    const songs = this.songs();
    const total = songs.reduce((acc, song) => acc + song.duration, 0);
    return Utils.secondsToText(total / this.oneSecondInMs);
  }

  getPage(pageNumber: number) {
    const { firstPage, amountPerPage, firstSongIsHeader } = this;
    const songAdditional = firstSongIsHeader ? 0 : 1;
    const songs = this.songs();
    const header = this.hearder ? this.hearder() : "";
    const initalIndex =
      pageNumber == firstPage
        ? firstSongIsHeader
        : pageNumber * amountPerPage - (amountPerPage + 1) + songAdditional;
    let content = `${header}\n\n`;

    for (
      let i = initalIndex;
      i < initalIndex + amountPerPage && songs[i];
      i++
    ) {
      const index = firstSongIsHeader ? i : i + 1;
      content += `**${index}**. [${songs[i].title}](${songs[i].url}) [${songs[i].durationFormatted}]\n`;
    }

    return content;
  }

  getEmbed() {
    const { currentPag, title, interaction, firstSongIsHeader } = this;
    const totalPages = this.getTotalPages();
    const formattedDuration = this.getFormattedDuration();
    const songs = this.songs();
    const pageContent = this.getPage(currentPag);
    const totalSongs = firstSongIsHeader
      ? songs.length - 1 == 0
        ? 1
        : songs.length - 1
      : songs.length;

    return new EmbedBuilder()
      .setColor("DarkBlue")
      .setDescription(pageContent)
      .setAuthor({
        name: `| ${title}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setFooter({
        text: `Total: ${totalSongs} | Pag's: ${currentPag}/${totalPages} | Duração: ${formattedDuration}`,
      });
  }

  getComponentsMessage() {
    const { currentPag, firstPage } = this;
    const totalPages = this.getTotalPages();

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(pagination.rewindToBeginning)
        .setEmoji("⏮️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPag == firstPage),
      new ButtonBuilder()
        .setCustomId(pagination.goBack)
        .setEmoji("⏪")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPag == firstPage),
      new ButtonBuilder()
        .setCustomId(pagination.advance)
        .setEmoji("⏩")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPag == totalPages),
      new ButtonBuilder()
        .setCustomId(pagination.advanceToEnd)
        .setEmoji("⏭️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPag == totalPages)
    );
  }

  editMessage(currentPag: number) {
    const { interaction } = this;

    interaction
      .editReply({
        embeds: [this.getEmbed()],
        components: [this.getComponentsMessage()],
      })
      .catch(() => {});
  }

  editForFrontPage() {
    this.editMessage((this.currentPag = this.firstPage));
  }

  async startPagination() {
    const { finishCommand, interaction, oneSecondInMs } = this;
    const mainMessage = await interaction.editReply({
      embeds: [this.getEmbed()],
      components: [this.getComponentsMessage()],
    });

    const collector = mainMessage.createMessageComponentCollector({
      filter: (i: any) => {
        i.deferUpdate();
        return i.user.id == interaction.user.id;
      },
      componentType: ComponentType.Button,
      time: finishCommand * oneSecondInMs,
      max: 30,
    });

    collector.on("collect", async (i: any) => {
      const songs = this.songs();
      const totalPages = this.getTotalPages();

      if (!songs.length) return collector.stop();

      if (this.currentPag > totalPages) return this.editForFrontPage();

      const buttonFunctions: Record<string, () => void> = {
        [pagination.advance]: () => this.editMessage(++this.currentPag),
        [pagination.goBack]: () => this.editMessage(--this.currentPag),
        [pagination.advanceToEnd]: () =>
          this.editMessage((this.currentPag = totalPages)),
        [pagination.rewindToBeginning]: () => this.editForFrontPage(),
      };

      buttonFunctions[i.customId]();
    });

    // collector.on("end", () =>
    //  interaction.editReply({ components: [] }).catch(() => {})
    // );
  }
}
