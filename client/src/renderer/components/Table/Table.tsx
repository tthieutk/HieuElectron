import './Table.scss';

interface TableFromProps {
	customProp: string;
}

export const TableFrom: React.FC<TableFromProps> = ({ customProp }) => {
	console.log(customProp);
	return (
		<table className="tb-from">
			<tr>
				<th>
					<div className="tb-from--th">
						期間<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<div className="tb-from--times">
							<span>
								<input type="text" className="tb-from--input" />
							</span>
							<span>
								<input type="text" className="tb-from--input" />
							</span>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						期間<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<div className="tb-from--times">
							<span>
								<input type="text" className="tb-from--input" />
							</span>
							<span>
								<input type="text" className="tb-from--input" />
							</span>
						</div>
						<div className="tb-from--days">
							<input type="text" className="tb-from--input" />
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						期間<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<div className="tb-from--days">
							<input type="text" className="tb-from--input" />
						</div>
						<div className="tb-from--times">
							<span>
								<input type="text" className="tb-from--input" />
							</span>
							<span>
								<input type="text" className="tb-from--input" />
							</span>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						用途<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>遅刻
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>早退
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>時間外勤務
							</label>
						</div>
					</div>
				</td>
			</tr>
			<tr> <th>  <div className="tb-from--th">  a<span className="txt-red">（必須）</span>  </div> </th>
				<td>
					<div className="tb-from--td">
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>入社日から適用
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>
								<input type="text" className="tb-from--input" />
								<p>から適用</p>
							</label>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						用途<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<h5 className="tb-from--title">■有給休暇</h5>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>遅刻
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>早退
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>時間外勤務
							</label>
						</div>
						<h5 className="tb-from--title">■無給休暇</h5>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>遅刻
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>早退
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>時間外勤務
							</label>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						用途<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>遅刻
							</label>
						</div>
						<div className="tb-from--checkbox">
							<label>
								<input type="checkbox" name="checkbox" />
								<span></span>早退
							</label>
						</div>
						<input type="text" className="tb-from--input" />
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						行先<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td tb-from--file">
						<input type="file" id="fileInput" className="tb-from--fileInput" />
						<input type="text" className="tb-from--input" />
						<button className="tb-from--button">ファイル選択</button>
						<button className="tb-from--button tb-from--button__red">
							キャンセル
						</button>
						<p>
							※全てのデータをひとつのフォルダにまとめてzipファイルに圧縮してからアップロードしてください。
						</p>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						行先<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<input type="text" className="tb-from--input" />
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">
						事由<span className="txt-red">（必須）</span>
					</div>
				</th>
				<td>
					<div className="tb-from--td">
						<textarea className="tb-from--area"></textarea>
					</div>
				</td>
			</tr>
			<tr>
				<th>
					<div className="tb-from--th">備考</div>
				</th>
				<td>
					<div className="tb-from--td">
						<textarea className="tb-from--area"></textarea>
					</div>
				</td>
			</tr>
		</table>
	);
};

export const TableBase = () => {
	return (
		<table className="table-base">
			<tr>
				<th>
					<button className="link">外出申請書</button>
				</th>
				<td>
					勤務時間内に外出（日帰り出張も含む）が必要になった場合に提出してください。
					<br />
					直行・直帰のため打刻ができない場合は、外出申請書に記載された時間へ打刻修正します。
					<br />
					早朝（9時以前）、夜間（18時半以降）の時間外勤務が発生する場合は、時間外勤務申請書も別途提出してください。{' '}
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">出張申請書</button>
				</th>
				<td>
					宿泊を伴う出張が必要になった場合に提出してください。
					<br />
					出張に伴う交通機関や宿泊施設の手配については総務課から都度案内します。{' '}
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">休日勤務申請書</button>
				</th>
				<td>
					休業日に勤務が必要になった場合に提出してください。
					<br />
					申請時間と実際の出退勤打刻に30分未満の差がある場合は打刻を基準とします。
					<br />
					申請時間と実際の出退勤打刻に30分以上の差が生じた場合は速やかに再申請をして承認を受けてください。
					<br />
					（再申請がない場合は当初の申請内容を基準とします）
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">遅刻・早退・時間外勤務申請書</button>
				</th>
				<td>
					【遅刻（公共交通機関の遅延時含む）をした】
					<br />
					公共交通機関遅延による事由の場合は公共交通機関が発行した遅延証明書の添付が必要です。事由によっては欠勤控除となる場合があります。
					<br />
					【早退をしたい】
					<br />
					事由によっては欠勤控除となる場合があります。
					<br />
					【定時以外の早朝および夜間の勤務が必要になった】
					<br />
					早朝勤務（9時以前）の場合は前日終業時まで、夜間勤務（18時半以降）の場合は当日終業時までに申請してください。
					<br />
					申請時間と実際の出退勤打刻に30分未満の差がある場合は打刻を基準とします。
					<br />
					申請時間と実際の出退勤打刻に30分以上の差が生じた場合は速やかに再申請をして承認を受けてください。
					<br />
					（再申請がない場合は当初の申請内容を基準とします）
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">勤怠打刻修正申請書</button>
				</th>
				<td>
					打刻を忘れた、誤って打刻をしてしまった場合に提出してください。
					<br />
					勤怠システム上では各自で打刻修正ができません。申請～承認の後に総務課で打刻修正します。
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">休暇届</button>
				</th>
				<td>
					休暇を取得したい場合に提出してください。
					<br />
					有給休暇は全休・半休(午前休・午後休)と分けて取得できます。
					<br />
					【半休取得時の就業期間】
					<br />
					・午前休（始業14：30～終業18：30）休憩無し
					<br />
					・午後休（始業9：30～終業13：30）休憩無し
					<br />
					有給休暇以外に無給休暇※（慶弔休暇、生理休暇、子の看護休暇）を取得する場合も休暇届で申請してください。
					<br />
					※無給休暇とは・・給与計算上は欠勤と同じ扱いになるため休んだ日数について欠勤控除が発生します。{' '}
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">交通費精算書</button>
				</th>
				<td>
					外出時の交通費を精算する際に提出してください。
					<br />
					（できる限り領収証の添付をお願いします。税込み3万円以上の運賃の場合は必ず領収証を添付してください。）{' '}
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">経費精算書（在宅勤務者用）</button>
				</th>
				<td>
					在宅勤務者が経費を立て替えた場合の清算時に提出してください。
					<br />
					交通費以外は領収証も必ず添付してください。
					<br />
					経費精算書、領収証原本（交通費以外）を総務課が受領した時点の勤怠締めにあわせて給与と合算して振込清算とします。
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">出張旅費精算書</button>
				</th>
				<td>
					宿泊を伴う出張の際にかかった交通費、経費などを精算する際に提出してください。
					<br />
					※領収証も必ず添付してください。{' '}
				</td>
			</tr>
			<tr>
				<th>
					<button className="link">通勤手当申請書</button>
				</th>
				<td>
					入社、転居、転勤等により通勤のための交通費が新たに発生、変更になった場合に提出してください。
				</td>
			</tr>
		</table>
	);
};
